import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, RefreshCw, Users, Search, ChevronDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const STATUS_CONFIG = {
  new: { label: 'جديد 🟡', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  contacted: { label: 'تم التواصل 🔵', color: 'bg-sky-50 text-sky-800 border-sky-200' },
  paid: { label: 'شرى وتفعل 🟢', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  cancelled: { label: 'غير مهتم / ملغى ⚪', color: 'bg-slate-100 text-slate-600 border-slate-200' }
};

export default function AdminWaitlist() {
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [activeTemplateMenu, setActiveTemplateMenu] = useState(null);

  const fetchWaitlist = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching waitlist:', error.message);
    else if (data) setWaitlist(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchWaitlist();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    // تحديث فـ UI الأول باش تكون سريعة
    setWaitlist(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));

    const { error } = await supabase
      .from('waitlist')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert('وقع خطأ أثناء تحديث الحالة: ' + error.message);
      fetchWaitlist();
    }
  };

  const getCleanPhone = (phone) => {
    return (phone || '').replace(/^0/, '').replace(/[^0-9]/g, '');
  };

  // قوالب الرسائل
  const getWhatsAppMessage = (type, item) => {
    const name = item.full_name || 'يا بطل';
    const offer = item.offer_id;

    if (type === 'welcome') {
      return `السلام عليكم ${name}، معاك فريق RR GESTION ⚡ شفت بلي حجزتي مقعدك فـ (${offer}). الدفعة الجديدة فتحات وبغينا نأكدو معاك الحساب باش تبدا الدروس. واش كلشي واضح ولا عندك شي تساؤل؟`;
    }
    if (type === 'payment') {
      return `السلام عليكم ${name}، بخصوص تفعيل اشتراكك فـ RR GESTION (${offer})، تقدر تحول المبلغ عبر حساب CIH ولا التجاري، ولا عبر Wafacash. صيفط لينا غير Reçu هنا وغادي يتفعل ليك الحساب فالبلاصة!`;
    }
    if (type === 'reminder') {
      return `السلام عليكم ${name}، غير تذكير خفيف من RR GESTION بخصوص حجزك لـ (${offer})، باقين مقاعد محدودة فهاد السيمانة باش تستافد من تخفيض البداية.`;
    }
    return '';
  };

  const openWhatsApp = (type, item) => {
    const text = encodeURIComponent(getWhatsAppMessage(type, item));
    const phone = getCleanPhone(item.phone);
    window.open(`https://wa.me/212${phone}?text=${text}`, '_blank');
    setActiveTemplateMenu(null);
  };

  const filteredList = waitlist.filter(item => {
    const matchesSearch = item.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.phone?.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || (item.status || 'new') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#FBFBF7] p-4 md:p-8 select-none" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
              title="رجوع للوحة التحكم الرئيسية"
            >
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-500" /> تتبع لائحة الانتظار
              </h1>
              <p className="text-xs font-bold text-slate-400 mt-0.5">
                إدارة ومراسلة الطلبة المهتمين بدون حذف
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="px-4 py-2 bg-slate-900 text-white font-black rounded-xl text-xs">
              المجموع: {waitlist.length}
            </span>
            <button
              onClick={fetchWaitlist}
              disabled={loading}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-7 relative">
            <Search className="w-5 h-5 absolute right-4 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="قلب بالسمية أو نمرة التلفون..."
              className="w-full p-3.5 pr-11 bg-white border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:border-slate-900 transition"
            />
          </div>

          <div className="sm:col-span-5">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl font-bold text-sm outline-none cursor-pointer"
            >
              <option value="ALL">🌟 جميع الحالات ({waitlist.length})</option>
              <option value="new">🟡 جديد</option>
              <option value="contacted">🔵 تم التواصل</option>
              <option value="paid">🟢 شرى وتفعل</option>
              <option value="cancelled">⚪ غير مهتم / ملغى</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-black">
                <tr>
                  <th className="p-4">الطالب</th>
                  <th className="p-4">العرض</th>
                  <th className="p-4">الحالة (Pipeline)</th>
                  <th className="p-4">تاريخ التسجيل</th>
                  <th className="p-4 text-center">مراسلة واتساب</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((item) => {
                  const currentStatus = item.status || 'new';
                  const isMenuOpen = activeTemplateMenu === item.id;

                  return (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/60">
                      
                      {/* الطالب */}
                      <td className="p-4">
                        <div className="font-black text-slate-900">{item.full_name}</div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5" dir="ltr">{item.phone}</div>
                      </td>

                      {/* العرض */}
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs font-bold">
                          {item.offer_id}
                        </span>
                      </td>

                      {/* تبديل الحالة */}
                      <td className="p-4">
                        <select
                          value={currentStatus}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className={`text-xs font-black px-3 py-1.5 rounded-xl border outline-none cursor-pointer transition ${STATUS_CONFIG[currentStatus]?.color || ''}`}
                        >
                          <option value="new">جديد 🟡</option>
                          <option value="contacted">تم التواصل 🔵</option>
                          <option value="paid">شرى وتفعل 🟢</option>
                          <option value="cancelled">غير مهتم ⚪</option>
                        </select>
                      </td>

                      {/* التاريخ */}
                      <td className="p-4 text-xs text-slate-400 font-mono" dir="ltr">
                        {new Date(item.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>

                      {/* زر الواتساب مع القوالب */}
                      <td className="p-4 text-center relative">
                        <div className="inline-flex items-center gap-1">
                          {/* الزر المباشر بالترحيب */}
                          <button
                            onClick={() => openWhatsApp('welcome', item)}
                            className="px-3 py-1.5 bg-[#22C55E] hover:bg-emerald-600 text-white font-black rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>ترحيب</span>
                          </button>

                          {/* سهم لاختيار قالب آخر */}
                          <button
                            onClick={() => setActiveTemplateMenu(isMenuOpen ? null : item.id)}
                            className="p-1.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded-xl transition cursor-pointer"
                            title="اختيار قالب رسالة أخرى"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Dropdown القوالب */}
                        {isMenuOpen && (
                          <div className="absolute left-1/2 -translate-x-1/2 top-14 z-30 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 space-y-1 text-right">
                            <button
                              onClick={() => openWhatsApp('welcome', item)}
                              className="w-full text-right px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl cursor-pointer"
                            >
                              👋 رسالة ترحيب وعرض
                            </button>
                            <button
                              onClick={() => openWhatsApp('payment', item)}
                              className="w-full text-right px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl cursor-pointer"
                            >
                              💳 تفاصيل وطريقة الدفع
                            </button>
                            <button
                              onClick={() => openWhatsApp('reminder', item)}
                              className="w-full text-right px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl cursor-pointer"
                            >
                              ⏳ تذكير بالمقاعد المتبقية
                            </button>
                          </div>
                        )}
                      </td>

                    </tr>
                  );
                })}

                {!loading && filteredList.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-slate-400 font-bold">
                      ما كاين حتى تسجيل مطابق.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}