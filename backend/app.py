from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
try:
    from predictor import predict_battery_health
except ImportError:
    import sys
    import os
    sys.path.append(os.path.dirname(__file__))
    from predictor import predict_battery_health
import os, json, io
from datetime import datetime
import pandas as pd

app = Flask(__name__)
app.secret_key = 'batteryiq_secret_2024'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///batteryiq.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message = 'Please log in to access BatteryIQ.'
login_manager.login_message_category = 'warning'


# ─────────────────────────────────────────────
# DATABASE MODELS
# ─────────────────────────────────────────────

class User(UserMixin, db.Model):
    id          = db.Column(db.Integer, primary_key=True)
    name        = db.Column(db.String(100), nullable=False)
    email       = db.Column(db.String(150), unique=True, nullable=False)
    password    = db.Column(db.String(256), nullable=False)
    role        = db.Column(db.String(20), nullable=False)   # 'driver' or 'technician'
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)
    predictions = db.relationship('Prediction', backref='user', lazy=True)


class Prediction(db.Model):
    id             = db.Column(db.Integer, primary_key=True)
    user_id        = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    timestamp      = db.Column(db.DateTime, default=datetime.utcnow)
    inputs         = db.Column(db.Text)           # JSON string of raw inputs
    stress_label   = db.Column(db.String(50))
    health_label   = db.Column(db.String(50))     # storing health score as string
    rul_value      = db.Column(db.Float)
    efficiency_pct = db.Column(db.Float)
    source         = db.Column(db.String(20), default='manual')  # 'manual' or 'csv'


def _pack_prediction_payload(inputs, outputs):
    """Store full input + output payload in existing text column."""
    return json.dumps({
        'inputs': inputs,
        'outputs': outputs
    })


def _summarize_fleet_for_user(user_id):
    preds = Prediction.query.filter_by(user_id=user_id).order_by(Prediction.timestamp.desc()).all()
    fleet_rows = []
    for idx, p in enumerate(preds, 1):
        fleet_rows.append({
            'idx': idx,
            'id': p.id,
            'timestamp': p.timestamp.strftime('%d %b %Y, %H:%M'),
            'source': p.source,
            'stress': p.stress_label,
            'health': float(p.health_label),
            'rul': int(p.rul_value),
            'efficiency': float(p.efficiency_pct)
        })
    return fleet_rows


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


# ─────────────────────────────────────────────
# AUTH ROUTES
# ─────────────────────────────────────────────

@app.route('/api/login', methods=['POST'])
def api_login():
    data    = request.get_json()
    email    = data.get('email', '').strip().lower()
    password = data.get('password')
    user     = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password, password):
        login_user(user)
        return jsonify({
            'success': True,
            'user': {
                'name': user.name,
                'email': user.email,
                'role': user.role
            }
        })
    return jsonify({'success': False, 'error': 'Invalid email or password.'}), 401


@app.route('/api/signup', methods=['POST'])
def api_signup():
    data     = request.get_json()
    name     = data.get('name', '').strip()
    email    = data.get('email', '').strip().lower()
    password = data.get('password')
    role     = data.get('role', 'driver')

    if User.query.filter_by(email=email).first():
        return jsonify({'success': False, 'error': 'Email already registered.'}), 400

    new_user = User(
        name     = name,
        email    = email,
        password = generate_password_hash(password),
        role     = role
    )
    db.session.add(new_user)
    db.session.commit()
    login_user(new_user)
    return jsonify({
        'success': True,
        'user': {
            'name': new_user.name,
            'email': new_user.email,
            'role': new_user.role
        }
    })


@app.route('/api/logout')
@login_required
def api_logout():
    logout_user()
    return jsonify({'success': True, 'message': 'Logged out.'})


# ─────────────────────────────────────────────
# DASHBOARD — role-based redirect
# ─────────────────────────────────────────────

@app.route('/dashboard')
@login_required
def dashboard():
    if current_user.role == 'technician':
        return redirect(url_for('technician'))
    return redirect(url_for('driver'))


# ─────────────────────────────────────────────
# MAIN PAGES
# ─────────────────────────────────────────────

@app.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    return render_template('index.html')


@app.route('/driver')
@login_required
def driver():
    if current_user.role != 'driver':
        flash('Access restricted to drivers only.', 'warning')
        return redirect(url_for('dashboard'))
    return render_template('driver.html', user=current_user)


@app.route('/technician')
@login_required
def technician():
    if current_user.role != 'technician':
        flash('Access restricted to technicians only.', 'warning')
        return redirect(url_for('dashboard'))
    fleet_rows = _summarize_fleet_for_user(current_user.id)
    return render_template('technician.html', user=current_user, fleet_rows=fleet_rows)


@app.route('/api/history')
@login_required
def api_history():
    preds = Prediction.query\
        .filter_by(user_id=current_user.id)\
        .order_by(Prediction.timestamp.desc())\
        .all()
    history_data = []
    for p in preds:
        history_data.append({
            'id': p.id,
            'timestamp': p.timestamp.strftime('%d %b %Y, %H:%M'),
            'stress': p.stress_label,
            'health': float(p.health_label),
            'rul': int(p.rul_value),
            'efficiency': float(p.efficiency_pct),
            'source': p.source
        })
    return jsonify({'success': True, 'history': history_data})


# ─────────────────────────────────────────────
# HISTORY — per user only
# ─────────────────────────────────────────────

@app.route('/history')
@login_required
def history():
    preds = Prediction.query\
        .filter_by(user_id=current_user.id)\
        .order_by(Prediction.timestamp.desc())\
        .all()
    return render_template('history.html', predictions=preds, user=current_user)


# ─────────────────────────────────────────────
# PUBLIC API — hero card battery data (no login needed)
# ─────────────────────────────────────────────

@app.route('/api/fleet_snapshot')
def fleet_snapshot():
    """Returns last-cycle stats for all batteries — used by landing page hero card."""
    try:
        import pandas as pd
        # Path updated to point to data folder in same directory
        data_path = os.path.join(os.path.dirname(__file__), 'data', 'master_df_final.csv')
        df = pd.read_csv(data_path)
        last = df.sort_values('cycle_number').groupby('battery_id').last().reset_index()
        batteries = []
        for _, row in last.iterrows():
            batteries.append({
                'id':         row['battery_id'],
                'health':     round(float(row['health_score']), 1),
                'stress':     str(row['stress_label']),
                'rul':        int(row['RUL']),
                'efficiency': round(float(row['efficiency_score']), 1),
                'cycle':      int(row['cycle_number']),
            })
        return jsonify({'success': True, 'batteries': batteries})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})


# ─────────────────────────────────────────────
# API PREDICT ROUTES (used by driver & technician JS)
# ─────────────────────────────────────────────

FEATURE_COLS = [
    'voltage_mean', 'voltage_min', 'voltage_std',
    'current_mean', 'current_std', 'current_min',
    'temp_mean', 'temp_max', 'temp_std',
    'duration', 'voltage_load_mean',
    'voltage_range', 'temp_rise',
    'power_mean', 'energy_delivered',
    'ambient_temperature', 'cycle_number'
]

def _map_driver_inputs(raw):
    """Map the 4 driver slider values to the 17 ML feature columns."""
    battery_pct   = float(raw.get('battery_pct', 80))
    temperature   = float(raw.get('temperature', 30))
    cycle_count   = float(raw.get('cycle_count', 50))
    trip_duration = float(raw.get('trip_duration', 2700))  # seconds
    ambient_temp  = float(raw.get('ambient_temp', 24))

    voltage_mean = 2.5 + (battery_pct / 100) * 1.7
    voltage_min  = voltage_mean - 0.8
    voltage_std  = 0.15 + (1 - battery_pct / 100) * 0.2

    current_mean = -0.5 - (battery_pct / 100) * 0.6
    current_std  = 0.15
    current_min  = current_mean - 0.3

    temp_mean = temperature
    temp_max  = temperature + 5
    temp_std  = 1.5

    duration          = trip_duration
    voltage_load_mean = voltage_mean - 0.5
    voltage_range     = voltage_mean - voltage_min
    temp_rise         = temp_max - ambient_temp
    power_mean        = abs(current_mean) * voltage_mean
    energy_delivered  = power_mean * (duration / 3600)

    return {
        'voltage_mean': round(voltage_mean, 3),
        'voltage_min':  round(voltage_min, 3),
        'voltage_std':  round(voltage_std, 3),
        'current_mean': round(current_mean, 3),
        'current_std':  round(current_std, 3),
        'current_min':  round(current_min, 3),
        'temp_mean':    round(temp_mean, 2),
        'temp_max':     round(temp_max, 2),
        'temp_std':     round(temp_std, 2),
        'duration':     round(duration, 1),
        'voltage_load_mean': round(voltage_load_mean, 3),
        'voltage_range':     round(voltage_range, 3),
        'temp_rise':         round(temp_rise, 2),
        'power_mean':        round(power_mean, 3),
        'energy_delivered':  round(energy_delivered, 3),
        'ambient_temperature': round(ambient_temp, 1),
        'cycle_number':        int(cycle_count),
    }


@app.route('/api/predict/driver', methods=['POST'])
@login_required
def api_predict_driver():
    raw    = request.get_json()
    inputs = _map_driver_inputs(raw)
    result = predict_battery_health(inputs)

    if result.get('success'):
        outputs = {
            'stress_label': result.get('stress_label'),
            'health_score': result.get('health_score'),
            'RUL': result.get('RUL'),
            'efficiency_score': result.get('efficiency_score'),
            'stress_info': result.get('stress_info'),
            'health_info': result.get('health_info'),
            'rul_info': result.get('rul_info'),
            'efficiency_info': result.get('efficiency_info'),
            'driver_summary': result.get('driver_summary')
        }
        pred = Prediction(
            user_id        = current_user.id,
            inputs         = _pack_prediction_payload(inputs, outputs),
            stress_label   = result.get('stress_label'),
            health_label   = str(result.get('health_score')),
            rul_value      = float(result.get('RUL', 0)),
            efficiency_pct = float(result.get('efficiency_score', 0)),
            source         = 'manual'
        )
        db.session.add(pred)
        db.session.commit()

    return jsonify(result)


@app.route('/api/predict/technician', methods=['POST'])
@login_required
def api_predict_technician():
    if current_user.role != 'technician':
        return jsonify({'success': False, 'error': 'Access denied'}), 403

    data   = request.get_json()
    result = predict_battery_health(data)

    if result.get('success'):
        outputs = {
            'stress_label': result.get('stress_label'),
            'health_score': result.get('health_score'),
            'RUL': result.get('RUL'),
            'efficiency_score': result.get('efficiency_score'),
            'stress_info': result.get('stress_info'),
            'health_info': result.get('health_info'),
            'rul_info': result.get('rul_info'),
            'efficiency_info': result.get('efficiency_info')
        }
        pred = Prediction(
            user_id        = current_user.id,
            inputs         = _pack_prediction_payload(data, outputs),
            stress_label   = result.get('stress_label'),
            health_label   = str(result.get('health_score')),
            rul_value      = float(result.get('RUL', 0)),
            efficiency_pct = float(result.get('efficiency_score', 0)),
            source         = 'manual'
        )
        db.session.add(pred)
        db.session.commit()

    return jsonify(result)


# ─────────────────────────────────────────────
# CSV UPLOAD — batch predictions (technician only)
# ─────────────────────────────────────────────

@app.route('/upload_csv', methods=['POST'])
@login_required
def upload_csv():
    if current_user.role != 'technician':
        flash('Access restricted to technicians only.', 'danger')
        return redirect(url_for('dashboard'))

    if 'csv_file' not in request.files:
        flash('No file selected.', 'danger')
        return redirect(url_for('technician'))

    file = request.files['csv_file']
    if file.filename == '' or not file.filename.endswith('.csv'):
        flash('Please upload a valid .csv file.', 'danger')
        return redirect(url_for('technician'))

    try:
        df = pd.read_csv(file)
    except Exception as e:
        flash(f'Could not read CSV: {str(e)}', 'danger')
        return redirect(url_for('technician'))

    # Validate columns
    missing = [c for c in FEATURE_COLS if c not in df.columns]
    if missing:
        flash(f'Missing columns: {", ".join(missing)}', 'danger')
        return redirect(url_for('technician'))

    if df.empty:
        flash('CSV file is empty.', 'danger')
        return redirect(url_for('technician'))

    results  = []
    errors   = []
    saved    = 0

    for idx, row in df.iterrows():
        try:
            input_data = {col: float(row[col]) for col in FEATURE_COLS}
            result     = predict_battery_health(input_data)

            if result.get('success'):
                outputs = {
                    'stress_label': result.get('stress_label'),
                    'health_score': result.get('health_score'),
                    'RUL': result.get('RUL'),
                    'efficiency_score': result.get('efficiency_score'),
                    'stress_info': result.get('stress_info'),
                    'health_info': result.get('health_info'),
                    'rul_info': result.get('rul_info'),
                    'efficiency_info': result.get('efficiency_info')
                }
                pred = Prediction(
                    user_id        = current_user.id,
                    inputs         = _pack_prediction_payload(input_data, outputs),
                    stress_label   = result.get('stress_label'),
                    health_label   = str(result.get('health_score')),
                    rul_value      = float(result.get('RUL', 0)),
                    efficiency_pct = float(result.get('efficiency_score', 0)),
                    source         = 'csv'
                )
                db.session.add(pred)
                db.session.flush()
                saved += 1
                results.append({
                    'row':        idx + 1,
                    'stress':     result.get('stress_label'),
                    'health':     result.get('health_score'),
                    'rul':        result.get('RUL'),
                    'efficiency': result.get('efficiency_score'),
                    'stress_color':     result['stress_info']['color'],
                    'health_color':     result['health_info']['color'],
                    'rul_color':        result['rul_info']['color'],
                    'efficiency_color': result['efficiency_info']['color'],
                    'prediction_id':    pred.id,
                })
            else:
                errors.append(f'Row {idx + 1}: {result.get("error")}')
        except Exception as e:
            errors.append(f'Row {idx + 1}: {str(e)}')

    db.session.commit()

    avg_health = round(sum(r['health'] for r in results) / len(results), 2) if results else 0
    risk_weight = {'Low': 1, 'Medium': 2, 'High': 3}
    highest_risk = None
    if results:
        highest_risk = max(results, key=lambda r: (risk_weight.get(r['stress'], 0), -r['health'], -r['rul']))

    return render_template(
        'technician.html',
        user=current_user,
        fleet_rows=_summarize_fleet_for_user(current_user.id),
        csv_results=results,
        csv_errors=errors,
        csv_saved=saved,
        total_rows=len(df),
        csv_avg_health=avg_health,
        csv_highest_risk=highest_risk
    )


@app.route('/download_sample_csv')
@login_required
def download_sample_csv():
    if current_user.role != 'technician':
        return redirect(url_for('dashboard'))

    sample = pd.DataFrame([{
        'voltage_mean': 3.475, 'voltage_min': 2.470, 'voltage_std': 0.284,
        'current_mean': -0.952, 'current_std': 0.201, 'current_min': -1.001,
        'temp_mean': 8.27, 'temp_max': 12.37, 'temp_std': 1.45,
        'duration': 6436, 'voltage_load_mean': 2.817,
        'voltage_range': 1.005, 'temp_rise': 4.10,
        'power_mean': 3.306, 'energy_delivered': 5.902,
        'ambient_temperature': 4, 'cycle_number': 1
    }, {
        'voltage_mean': 3.20, 'voltage_min': 2.10, 'voltage_std': 0.35,
        'current_mean': -1.50, 'current_std': 0.30, 'current_min': -2.00,
        'temp_mean': 35.0, 'temp_max': 45.0, 'temp_std': 3.5,
        'duration': 4000, 'voltage_load_mean': 2.60,
        'voltage_range': 1.10, 'temp_rise': 11.0,
        'power_mean': 4.80, 'energy_delivered': 5.33,
        'ambient_temperature': 24, 'cycle_number': 120
    }])

    buf = io.BytesIO()
    sample.to_csv(buf, index=False)
    buf.seek(0)
    return send_file(buf, mimetype='text/csv',
                     as_attachment=True,
                     download_name='batteryiq_sample.csv')


# ─────────────────────────────────────────────
# PDF EXPORT — prediction history
# ─────────────────────────────────────────────

@app.route('/api/export_pdf')
@login_required
def export_pdf():
    from reportlab.lib.pagesizes import A4
    from reportlab.lib import colors
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import cm
    from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer

    preds = Prediction.query\
        .filter_by(user_id=current_user.id)\
        .order_by(Prediction.timestamp.asc())\
        .all()

    buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4,
                            leftMargin=2*cm, rightMargin=2*cm,
                            topMargin=2*cm, bottomMargin=2*cm)

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle('title', parent=styles['Title'],
                                 fontSize=18, textColor=colors.HexColor('#00d97e'))
    sub_style   = ParagraphStyle('sub', parent=styles['Normal'],
                                 fontSize=10, textColor=colors.grey)
    head_style  = ParagraphStyle('head', parent=styles['Heading2'],
                                 fontSize=12, textColor=colors.HexColor('#3b82f6'))

    story = []

    # Title
    story.append(Paragraph('⚡ BatteryIQ — Prediction Report', title_style))
    story.append(Paragraph(
        f'User: {current_user.name}  |  Role: {current_user.role.title()}  |  '
        f'Generated: {datetime.utcnow().strftime("%d %b %Y, %H:%M")} UTC',
        sub_style))
    story.append(Spacer(1, 0.5*cm))

    if not preds:
        story.append(Paragraph('No predictions found.', styles['Normal']))
    else:
        # Summary stats
        avg_health = sum(float(p.health_label) for p in preds) / len(preds)
        avg_rul    = sum(p.rul_value for p in preds) / len(preds)
        avg_eff    = sum(p.efficiency_pct for p in preds) / len(preds)
        stress_counts = {'Low': 0, 'Medium': 0, 'High': 0}
        for p in preds:
            stress_counts[p.stress_label] = stress_counts.get(p.stress_label, 0) + 1

        story.append(Paragraph('Summary Statistics', head_style))
        summary_data = [
            ['Metric', 'Value'],
            ['Total Predictions', str(len(preds))],
            ['Avg Health Score', f'{avg_health:.1f} / 100'],
            ['Avg RUL', f'{avg_rul:.0f} cycles'],
            ['Avg Efficiency', f'{avg_eff:.1f}%'],
            ['Stress — Low / Medium / High',
             f'{stress_counts["Low"]} / {stress_counts["Medium"]} / {stress_counts["High"]}'],
        ]
        summary_table = Table(summary_data, colWidths=[9*cm, 7*cm])
        summary_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e293b')),
            ('TEXTCOLOR',  (0, 0), (-1, 0), colors.HexColor('#00d97e')),
            ('FONTNAME',   (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE',   (0, 0), (-1, -1), 9),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1),
             [colors.HexColor('#0f172a'), colors.HexColor('#1e293b')]),
            ('TEXTCOLOR',  (0, 1), (-1, -1), colors.white),
            ('GRID',       (0, 0), (-1, -1), 0.5, colors.HexColor('#334155')),
            ('PADDING',    (0, 0), (-1, -1), 6),
        ]))
        story.append(summary_table)
        story.append(Spacer(1, 0.5*cm))

        # Prediction history table
        story.append(Paragraph('Prediction History', head_style))
        table_data = [['#', 'Date & Time', 'Stress', 'Health', 'RUL', 'Efficiency', 'Source']]
        for i, p in enumerate(preds, 1):
            table_data.append([
                str(i),
                p.timestamp.strftime('%d %b %Y %H:%M'),
                p.stress_label,
                f'{float(p.health_label):.1f}',
                f'{int(p.rul_value)}',
                f'{p.efficiency_pct:.1f}%',
                p.source,
            ])

        col_widths = [1*cm, 4.5*cm, 2.5*cm, 2.5*cm, 2*cm, 3*cm, 2*cm]
        hist_table = Table(table_data, colWidths=col_widths, repeatRows=1)
        hist_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e293b')),
            ('TEXTCOLOR',  (0, 0), (-1, 0), colors.HexColor('#3b82f6')),
            ('FONTNAME',   (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE',   (0, 0), (-1, -1), 8),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1),
             [colors.HexColor('#0f172a'), colors.HexColor('#1e293b')]),
            ('TEXTCOLOR',  (0, 1), (-1, -1), colors.white),
            ('GRID',       (0, 0), (-1, -1), 0.5, colors.HexColor('#334155')),
            ('PADDING',    (0, 0), (-1, -1), 5),
            ('ALIGN',      (0, 0), (-1, -1), 'CENTER'),
        ]))
        story.append(hist_table)

    doc.build(story)
    buf.seek(0)
    filename = f'batteryiq_report_{current_user.name.replace(" ", "_")}_{datetime.utcnow().strftime("%Y%m%d")}.pdf'
    return send_file(buf, mimetype='application/pdf',
                     as_attachment=True, download_name=filename)


@app.route('/export_pdf/<int:prediction_id>')
@login_required
def export_single_pdf(prediction_id):
    from reportlab.lib.pagesizes import A4
    from reportlab.lib import colors
    from reportlab.lib.styles import getSampleStyleSheet
    from reportlab.lib.units import cm
    from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer

    pred = Prediction.query.filter_by(id=prediction_id, user_id=current_user.id).first()
    if not pred:
        flash('Prediction not found for export.', 'danger')
        return redirect(url_for('history'))

    try:
        payload = json.loads(pred.inputs or '{}')
    except Exception:
        payload = {}
    if isinstance(payload, dict) and 'inputs' in payload:
        inputs = payload.get('inputs', {})
    else:
        inputs = payload if isinstance(payload, dict) else {}

    buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4, leftMargin=2*cm, rightMargin=2*cm, topMargin=2*cm, bottomMargin=2*cm)
    styles = getSampleStyleSheet()
    story = []

    story.append(Paragraph('BatteryIQ — Prediction Detail Report', styles['Title']))
    story.append(Paragraph(f'Generated: {datetime.utcnow().strftime("%d %b %Y, %H:%M")} UTC', styles['Normal']))
    story.append(Spacer(1, 0.4*cm))

    summary = [
        ['Date & Time', pred.timestamp.strftime('%d %b %Y, %H:%M')],
        ['Input Method', pred.source],
        ['Stress', pred.stress_label],
        ['Health Score', f'{float(pred.health_label):.2f}/100'],
        ['RUL', f'{int(pred.rul_value)} cycles'],
        ['Efficiency', f'{float(pred.efficiency_pct):.2f}/100']
    ]
    summary_table = Table([['Metric', 'Value']] + summary, colWidths=[6.5*cm, 8.5*cm])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e293b')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 0.4*cm))

    input_rows = [['Input Parameter', 'Value']]
    for k, v in inputs.items():
        input_rows.append([str(k), str(v)])
    input_table = Table(input_rows, colWidths=[6.5*cm, 8.5*cm])
    input_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#334155')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(input_table)

    doc.build(story)
    buf.seek(0)
    return send_file(buf, mimetype='application/pdf', as_attachment=True,
                     download_name=f'batteryiq_prediction_{prediction_id}.pdf')


# ─────────────────────────────────────────────
# INIT DB & RUN
# ─────────────────────────────────────────────

with app.app_context():
    db.create_all()

@app.route('/map')
@login_required
def map_view():
    return render_template('map.html', user=current_user)


# ─────────────────────────────────────────────
# EDIT PROFILE
# ─────────────────────────────────────────────

@app.route('/edit_profile', methods=['GET', 'POST'])
@login_required
def edit_profile():
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip().lower()
        new_password = request.form.get('new_password', '').strip()
        current_password = request.form.get('current_password', '').strip()

        if not check_password_hash(current_user.password, current_password):
            flash('Current password is incorrect.', 'danger')
            return redirect(url_for('edit_profile'))

        # Check email not taken by another user
        existing = User.query.filter_by(email=email).first()
        if existing and existing.id != current_user.id:
            flash('That email is already in use.', 'danger')
            return redirect(url_for('edit_profile'))

        current_user.name = name
        current_user.email = email
        if new_password:
            if len(new_password) < 6:
                flash('New password must be at least 6 characters.', 'danger')
                return redirect(url_for('edit_profile'))
            current_user.password = generate_password_hash(new_password)

        db.session.commit()
        flash('Profile updated successfully!', 'success')
        return redirect(url_for('dashboard'))

    return render_template('edit_profile.html', user=current_user)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
