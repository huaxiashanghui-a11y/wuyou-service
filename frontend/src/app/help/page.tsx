'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronDown, ChevronUp, Mail, Phone, MessageCircle, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: '如何购买点卡？',
    answer:
      '您可以在我们的商城选择您需要的商品，加入购物车后前往结算页面。填写您的联系方式（邮箱或手机），完成支付后，卡密将自动发送到您的邮箱或手机。',
  },
  {
    question: '支付后多久能收到卡密？',
    answer:
      '支付成功后，卡密将在几秒钟内自动发送到您的邮箱。如果选择手机接收，通常在1分钟内送达。请确保您的邮箱或手机填写正确。',
  },
  {
    question: '收到的卡密无法使用怎么办？',
    answer:
      '如果卡密无法使用，请首先确认您是在正确的平台或游戏中使用。如果确认无误，请联系我们的客服，提供订单号和卡密，我们会尽快为您处理。',
  },
  {
    question: '支持哪些支付方式？',
    answer:
      '我们支持支付宝、微信支付、信用卡等多种支付方式。您可以在结算页面选择最适合您的支付方式。',
  },
  {
    question: '可以开发票吗？',
    answer:
      '由于我们的商品为数字产品，根据相关法规，数字产品的充值类商品不支持开发票。如有特殊需求，请联系客服咨询。',
  },
  {
    question: '订单可以退款吗？',
    answer:
      '由于数字商品的特殊性，一旦卡密发送成功（即订单状态变为&quot;已完成&quot;），不支持退款。在卡密发送前，您可以申请取消订单并退款。',
  },
];

const guides = [
  {
    title: '充值教程',
    icon: '📱',
    steps: [
      '在商城选择您需要的商品',
      '完成支付后获取卡密',
      '打开对应的游戏或平台',
      '找到充值入口，输入卡密',
      '确认充值，享受服务',
    ],
  },
  {
    title: '常见问题',
    icon: '❓',
    steps: [
      '支付后未收到卡密：请检查垃圾邮件夹，或联系客服',
      '卡密显示已使用：可能为系统延迟，请稍后再试',
      '充值失败：请确认卡密输入正确，注意区分数字0和字母O',
    ],
  },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-14">
        <div className="container-custom py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">帮助中心</h1>
            <p className="text-text-muted">遇到问题？在这里找到答案</p>
          </div>

          {/* Quick Contact */}
          <div className="card-dark p-6 mb-8">
            <h2 className="text-lg font-bold text-text-primary mb-4">快速联系客服</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="mailto:support@wuyou.com"
                className="flex items-center gap-3 p-4 bg-dark-primary rounded-xl hover:bg-accent/10 transition-colors border border-dark-border"
              >
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-text-primary">邮箱联系</p>
                  <p className="text-sm text-text-muted">support@wuyou.com</p>
                </div>
              </a>
              <a
                href="tel:400-888-8888"
                className="flex items-center gap-3 p-4 bg-dark-primary rounded-xl hover:bg-success/10 transition-colors border border-dark-border"
              >
                <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="font-medium text-text-primary">电话客服</p>
                  <p className="text-sm text-text-muted">400-888-8888</p>
                </div>
              </a>
              <div className="flex items-center gap-3 p-4 bg-dark-primary rounded-xl border border-dark-border">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="font-medium text-text-primary">在线客服</p>
                  <p className="text-sm text-text-muted">9:00 - 21:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Guides */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-text-primary mb-4">使用指南</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guides.map((guide) => (
                <div key={guide.title} className="card-dark p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{guide.icon}</span>
                    <h3 className="text-lg font-bold text-text-primary">{guide.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {guide.steps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-accent font-bold">{index + 1}.</span>
                        <span className="text-text-secondary">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-xl font-bold text-text-primary mb-4">常见问题</h2>
            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <div key={index} className="card-dark overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-dark-primary transition-colors"
                  >
                    <span className="font-medium text-text-primary flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-accent" />
                      {faq.question}
                    </span>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-text-muted" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-text-muted" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-4 pb-4 text-sm text-text-secondary leading-relaxed border-t border-dark-border pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
