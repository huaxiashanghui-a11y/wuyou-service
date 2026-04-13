import { HelpCircle, CreditCard, Mail, Shield, Clock, FileText } from 'lucide-react'

const faqs = [
  {
    icon: CreditCard,
    question: '如何购买点卡？',
    answer: '在商城选择您需要的商品，点击购买，填写邮箱地址，完成支付后卡密会自动发送到您的邮箱。'
  },
  {
    icon: Mail,
    question: '支付后多久能收到卡密？',
    answer: '支付成功后，系统会在几秒内自动发送卡密到您的邮箱。如果超过5分钟未收到，请检查垃圾邮件或联系客服。'
  },
  {
    icon: Shield,
    question: '购买后可以退款吗？',
    answer: '由于卡密商品的特殊性，一旦发出无法撤回，因此购买前请确认商品信息。特殊情况请联系客服处理。'
  },
  {
    icon: Clock,
    question: '支持哪些支付方式？',
    answer: '我们支持微信支付、支付宝、QQ钱包等多种支付方式，满足您的不同需求。'
  },
  {
    icon: FileText,
    question: '卡密充值教程',
    answer: '不同游戏的充值方式各不相同。一般流程为：登录游戏 -> 进入充值页面 -> 选择卡密充值 -> 输入卡密和密码 -> 确认充值。'
  }
]

const guides = [
  {
    title: '微信支付教程',
    description: '详细图文教程',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop',
    link: '#'
  },
  {
    title: '支付宝支付教程',
    description: '详细图文教程',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
    link: '#'
  },
  {
    title: 'Steam充值教程',
    description: '详细图文教程',
    image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=300&fit=crop',
    link: '#'
  }
]

export const metadata = {
  title: '帮助中心 - 无忧服务',
  description: '常见问题解答和充值教程',
}

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">帮助中心</h1>
        <p className="text-gray-600">常见问题解答和充值教程</p>
      </div>

      {/* Quick Contact */}
      <div className="glass rounded-2xl p-6 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary-100 flex items-center justify-center">
              <Mail className="w-6 h-6 text-primary-500" />
            </div>
            <h3 className="font-bold mb-1">邮箱支持</h3>
            <p className="text-sm text-gray-600">support@wuyou.com</p>
          </div>
          <div>
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-secondary-100 flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-secondary-500" />
            </div>
            <h3 className="font-bold mb-1">在线客服</h3>
            <p className="text-sm text-gray-600">7x24 小时服务</p>
          </div>
          <div>
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-accent-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-accent-500" />
            </div>
            <h3 className="font-bold mb-1">响应时间</h3>
            <p className="text-sm text-gray-600">平均 1 小时内回复</p>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">常见问题</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <div key={index} className="glass rounded-2xl p-6 card-hover">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
                  <faq.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guides */}
      <div>
        <h2 className="text-2xl font-bold mb-6">充值教程</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((guide, index) => (
            <a
              key={index}
              href={guide.link}
              className="glass rounded-2xl overflow-hidden card-hover"
            >
              <div className="relative h-40">
                <img
                  src={guide.image}
                  alt={guide.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-1">{guide.title}</h3>
                <p className="text-sm text-gray-600">{guide.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Additional Help */}
      <div className="mt-12 glass rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-4 text-center">还有其他问题？</h2>
        <p className="text-center text-gray-600 mb-6">
          我们随时为您提供帮助。请通过以下方式联系我们
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:support@wuyou.com"
            className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all text-center"
          >
            发送邮件
          </a>
          <a
            href="#"
            className="px-6 py-3 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all text-center"
          >
            在线客服
          </a>
        </div>
      </div>
    </div>
  )
}
