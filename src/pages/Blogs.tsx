import Layout from '@/components/Layout';
import ScrollReveal from '@/components/ScrollReveal';
import TiltCard from '@/components/TiltCard';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const posts = [
  {
    id: 'data-driven-ev-battery-degradation',
    title: 'Data-Driven Models Improve Accuracy in Predicting EV Battery Degradation',
    excerpt: 'How machine learning models using real-world cycling data can predict State of Health (SOH) with unprecedented accuracy — and what it means for fleet operators managing battery lifecycles.',
    date: 'Mar 15, 2025',
    readTime: '8 min',
    tag: 'Research',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop',
  },
  {
    id: 'lfp-vs-nmc-fleet-comparison',
    title: 'LFP vs NMC: Which Battery Chemistry is Right for Your Fleet?',
    excerpt: 'Lithium Iron Phosphate offers superior cycle life and thermal stability, while Nickel Manganese Cobalt delivers higher energy density. Here\'s how to choose based on your fleet\'s operating conditions.',
    date: 'Feb 28, 2025',
    readTime: '12 min',
    tag: 'Technology',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=400&fit=crop',
  },
  {
    id: 'predictive-maintenance-fleet-savings',
    title: 'How Predictive Maintenance Saved a Fleet $2.4M in One Year',
    excerpt: 'Case study: A 200-vehicle logistics fleet used AI-powered battery monitoring to slash replacement costs by 45% and reduce unplanned downtime by 60% in Maharashtra, India.',
    date: 'Feb 10, 2025',
    readTime: '6 min',
    tag: 'Case Study',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&h=400&fit=crop',
  },
  {
    id: 'understanding-soh-ev-batteries',
    title: 'Understanding State of Health (SOH) in EV Batteries',
    excerpt: 'SOH measures a battery\'s current capacity relative to its original rated capacity. Learn why it matters more than range for fleet operations and how AI makes measurement non-invasive.',
    date: 'Jan 22, 2025',
    readTime: '10 min',
    tag: 'Education',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop',
  },
  {
    id: 'ai-predicts-ev-battery-degradation',
    title: 'How AI Predicts EV Battery Degradation Before It Happens',
    excerpt: 'AI uses real-time sensor data to predict battery wear, recommend better charging habits, and flag maintenance needs early — extending battery life and saving fleet operators thousands.',
    date: 'Jan 5, 2025',
    readTime: '15 min',
    tag: 'Industry',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
  },
  {
    id: 'nasa-battery-dataset-ml-models',
    title: 'How NASA Battery Data Powers Next-Gen Fleet Intelligence',
    excerpt: 'NASA\'s publicly available battery cycling datasets have become the gold standard for training ML models. Here\'s how BatteryIQ leverages this data to deliver 97%+ prediction accuracy.',
    date: 'Dec 18, 2024',
    readTime: '9 min',
    tag: 'Research',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&h=400&fit=crop',
  },
];

export default function Blogs() {
  return (
    <Layout>
      <section className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Blog</span>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mt-3">
                Insights & <span className="text-gradient">Updates</span>
              </h1>
              <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
                Industry analysis, product updates, and deep dives into battery intelligence.
              </p>
            </div>
          </ScrollReveal>

          {/* Featured post */}
          <ScrollReveal>
            <TiltCard>
              <Link to={`/blogs/${posts[0].id}`} className="block">
                <div className="glass cyber-border rounded-2xl overflow-hidden mb-8 group cursor-pointer">
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-96 h-56 lg:h-auto overflow-hidden">
                      <img src={posts[0].image} alt={posts[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 p-8">
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider">{posts[0].tag}</span>
                      <h2 className="text-2xl lg:text-3xl font-bold text-foreground mt-2 group-hover:text-primary transition-colors">{posts[0].title}</h2>
                      <p className="text-muted-foreground mt-3">{posts[0].excerpt}</p>
                      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{posts[0].date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{posts[0].readTime}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-primary">
                        Read more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </TiltCard>
          </ScrollReveal>

          {/* Post grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(1).map((post, i) => (
              <ScrollReveal key={post.id} delay={i * 80}>
                <TiltCard>
                  <Link to={`/blogs/${post.id}`} className="block h-full">
                    <div className="glass cyber-border cyber-border-hover rounded-2xl overflow-hidden h-full group cursor-pointer">
                      <div className="h-44 overflow-hidden">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-6">
                        <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">{post.tag}</span>
                        <h3 className="text-lg font-semibold text-foreground mt-2 mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
