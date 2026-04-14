'use client';

import { useState } from 'react';
import { MessageSquare, AlertTriangle, Package, HelpCircle, Send, CheckCircle, ImageIcon } from 'lucide-react';

type TabType = 'suggestions' | 'complaints' | 'outofstock' | 'faq';

interface FaqItem {
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    question: '如何注册成为会员？',
    answer: '点击首页右上角的"注册"按钮，填写手机号码和验证码即可完成注册。',
  },
  {
    question: '如何充值账户？',
    answer: '登录后进入个人中心，点击"充值"按钮，选择充值金额和支付方式完成支付即可。',
  },
  {
    question: '充值有手续费吗？',
    answer: '平台充值免收手续费，实际到账金额等于充值金额。',
  },
  {
    question: '如何联系客服？',
    answer: '您可以通过页面右下角的在线客服图标联系我们，或拨打客服热线。',
  },
  {
    question: '订单审核需要多久？',
    answer: '一般情况下，订单审核时间为1-24小时，具体以实际情况为准。',
  },
  {
    question: '如何查看订单状态？',
    answer: '登录后进入"我的订单"页面，可以查看所有订单的状态和详情。',
  },
];

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState<TabType>('suggestions');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Form states
  const [suggestionContent, setSuggestionContent] = useState('');
  const [suggestionImages, setSuggestionImages] = useState<string[]>([]);
  const [complaintContent, setComplaintContent] = useState('');
  const [complaintImages, setComplaintImages] = useState<string[]>([]);
  const [outOfStockProduct, setOutOfStockProduct] = useState('');
  const [outOfStockImages, setOutOfStockImages] = useState<string[]>([]);
  const [contact, setContact] = useState('');

  const [submitted, setSubmitted] = useState(false);

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'suggestions', label: '用户建议', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'complaints', label: '投诉', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'outofstock', label: '缺货登记', icon: <Package className="w-4 h-4" /> },
    { id: 'faq', label: '常见问题', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  const handleImageUpload = (
    type: 'suggestion' | 'complaint' | 'outofstock',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).slice(0, 3).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            newImages.push(reader.result as string);
            if (newImages.length === Array.from(files).slice(0, 3).length) {
              if (type === 'suggestion') setSuggestionImages([...suggestionImages, ...newImages]);
              else if (type === 'complaint') setComplaintImages([...complaintImages, ...newImages]);
              else setOutOfStockImages([...outOfStockImages, ...newImages]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSuggestionContent('');
      setSuggestionImages([]);
      setComplaintContent('');
      setComplaintImages([]);
      setOutOfStockProduct('');
      setOutOfStockImages([]);
      setContact('');
    }, 2000);
  };

  const ImageUploadArea = ({
    images,
    type,
    onRemove,
  }: {
    images: string[];
    type: string;
    onRemove: (index: number) => void;
  }) => (
    <div className="flex flex-wrap gap-2">
      {images.map((img, idx) => (
        <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
          <img src={img} alt={`上传图片${idx + 1}`} className="w-full h-full object-cover" />
          <button
            onClick={() => onRemove(idx)}
            className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-bl-lg"
          >
            ×
          </button>
        </div>
      ))}
      {images.length < 3 && (
        <label className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 transition-colors">
          <ImageIcon className="w-6 h-6 text-gray-300" />
          <span className="text-xs text-gray-400 mt-1">添加图片</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleImageUpload(type as 'suggestion' | 'complaint' | 'outofstock', e)}
            className="hidden"
          />
        </label>
      )}
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">帮助中心</h1>
        <p className="text-sm text-gray-500 mt-1">有问题？在这里找到答案或联系我们</p>
      </div>

      {/* Tabs */}
      <div className="glass rounded-xl mb-6">
        <div className="flex flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'text-orange-600 border-b-2 border-orange-500'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Success Message */}
      {submitted && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <div>
            <p className="font-medium text-green-700">提交成功！</p>
            <p className="text-sm text-green-600">感谢您的反馈，我们会尽快处理</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* User Suggestions */}
        {activeTab === 'suggestions' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">提交建议</h3>
            <p className="text-sm text-gray-500 mb-6">您的建议是我们改进的动力</p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">建议内容 *</label>
              <textarea
                value={suggestionContent}
                onChange={(e) => setSuggestionContent(e.target.value)}
                placeholder="请详细描述您的建议..."
                rows={5}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">上传图片（可选）</label>
              <ImageUploadArea
                images={suggestionImages}
                type="suggestion"
                onRemove={(idx) => setSuggestionImages(suggestionImages.filter((_, i) => i !== idx))}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">联系方式</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="手机号或邮箱（选填）"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!suggestionContent.trim()}
              className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                suggestionContent.trim()
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              提交建议
            </button>
          </div>
        )}

        {/* Complaints */}
        {activeTab === 'complaints' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">投诉反馈</h3>
            <p className="text-sm text-gray-500 mb-6">我们会认真对待每一个投诉</p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">投诉内容 *</label>
              <textarea
                value={complaintContent}
                onChange={(e) => setComplaintContent(e.target.value)}
                placeholder="请详细描述您遇到的问题..."
                rows={5}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">上传图片（可选）</label>
              <ImageUploadArea
                images={complaintImages}
                type="complaint"
                onRemove={(idx) => setComplaintImages(complaintImages.filter((_, i) => i !== idx))}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">联系方式 *</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="手机号或邮箱"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!complaintContent.trim() || !contact.trim()}
              className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                complaintContent.trim() && contact.trim()
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              提交投诉
            </button>
          </div>
        )}

        {/* Out of Stock Registration */}
        {activeTab === 'outofstock' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">缺货登记</h3>
            <p className="text-sm text-gray-500 mb-6">告诉我们您需要的商品，我们会尽快补货</p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">商品名称 *</label>
              <input
                type="text"
                value={outOfStockProduct}
                onChange={(e) => setOutOfStockProduct(e.target.value)}
                placeholder="请输入您需要的商品名称"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">上传图片（可选）</label>
              <ImageUploadArea
                images={outOfStockImages}
                type="outofstock"
                onRemove={(idx) => setOutOfStockImages(outOfStockImages.filter((_, i) => i !== idx))}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">联系方式 *</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="到货后通知您的方式"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!outOfStockProduct.trim() || !contact.trim()}
              className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                outOfStockProduct.trim() && contact.trim()
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Package className="w-4 h-4" />
              提交登记
            </button>
          </div>
        )}

        {/* FAQ */}
        {activeTab === 'faq' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">常见问题</h3>

            <div className="space-y-3">
              {faqData.map((item, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{item.question}</span>
                    <span
                      className={`text-gray-400 transition-transform ${
                        expandedFaq === idx ? 'rotate-180' : ''
                      }`}
                    >
                      ▼
                    </span>
                  </button>
                  {expandedFaq === idx && (
                    <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-orange-50 rounded-xl">
              <p className="text-sm text-orange-800">
                没有找到您需要的答案？
                <button className="ml-2 text-orange-600 font-medium hover:underline">
                  联系在线客服
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
