import { useState } from 'react'

type NavItem = {
  id: string
  label: string
  icon: string
}

const navigation: NavItem[] = [
  { id: 'overview', label: 'نظرة عامة', icon: '◫' },
  { id: 'orders', label: 'الطلبات', icon: '▤' },
  { id: 'stores', label: 'المتاجر', icon: '⌂' },
  { id: 'finance', label: 'المالية', icon: '◈' },
  { id: 'claims', label: 'المطالبات', icon: '▧' },
  { id: 'reports', label: 'التقارير', icon: '▥' },
]

const transactions = [
  { id: '#MT-2048', customer: 'متجر الندى', date: 'اليوم، 10:42 ص', amount: '٢٤,٥٠٠ ر.ي', status: 'مكتمل', tone: 'success' },
  { id: '#MT-2047', customer: 'متجر التقنية', date: 'اليوم، 09:18 ص', amount: '١٨,٢٠٠ ر.ي', status: 'قيد المراجعة', tone: 'warning' },
  { id: '#MT-2046', customer: 'متجر الأمل', date: 'أمس، 04:35 م', amount: '٣٢,٠٠٠ ر.ي', status: 'مكتمل', tone: 'success' },
  { id: '#MT-2045', customer: 'متجر الريادة', date: 'أمس، 01:12 م', amount: '٩,٧٥٠ ر.ي', status: 'معلّق', tone: 'muted' },
]

const stats = [
  { label: 'إجمالي المبيعات', value: '١,٢٨٤,٥٠٠', unit: 'ر.ي', change: '+12.8%', icon: '↗', note: 'مقارنة بالشهر الماضي', color: 'green' },
  { label: 'الطلبات النشطة', value: '٢٤٨', unit: 'طلب', change: '+8.2%', icon: '▤', note: 'من إجمالي الطلبات', color: 'lime' },
  { label: 'المتاجر المسجلة', value: '٦٤', unit: 'متجر', change: '+4 هذا الشهر', icon: '⌂', note: 'متجر نشط على المنصة', color: 'blue' },
  { label: 'مطالبات تحتاج مراجعة', value: '١٢', unit: 'مطالبة', change: 'تتطلب إجراء', icon: '!', note: 'راجعها لتحديث حالتها', color: 'amber' },
]

function App() {
  const [active, setActive] = useState('overview')
  const [menuOpen, setMenuOpen] = useState(false)
  const activeLabel = navigation.find((item) => item.id === active)?.label ?? 'نظرة عامة'

  return (
    <div className="app-shell" dir="rtl">
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><span>M</span></div>
          <div className="brand-copy">
            <strong>MONEY TAKE</strong>
            <span>إدارة أعمالك بوضوح</span>
          </div>
          <button className="close-menu icon-button" onClick={() => setMenuOpen(false)} aria-label="إغلاق القائمة">×</button>
        </div>

        <div className="workspace-switcher">
          <div className="workspace-avatar">MT</div>
          <div className="workspace-copy"><strong>مساحة المنصة</strong><span>الإدارة الرئيسية</span></div>
          <span className="chevron">⌄</span>
        </div>

        <div className="nav-caption">القائمة الرئيسية</div>
        <nav className="main-nav" aria-label="القائمة الرئيسية">
          {navigation.map((item) => (
            <button
              className={`nav-item ${active === item.id ? 'active' : ''}`}
              key={item.id}
              onClick={() => { setActive(item.id); setMenuOpen(false) }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.id === 'claims' && <span className="nav-count">١٢</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">؟</div>
            <strong>هل تحتاج إلى مساعدة؟</strong>
            <p>فريقنا هنا لمساعدتك في كل خطوة.</p>
            <button onClick={() => setActive('support')}>مركز المساعدة <span>←</span></button>
          </div>
          <button className="profile">
            <div className="profile-avatar">م</div>
            <div className="profile-copy"><strong>مدير المنصة</strong><span>مدير النظام</span></div>
            <span className="profile-more">•••</span>
          </button>
        </div>
      </aside>

      {menuOpen && <button className="mobile-scrim" aria-label="إغلاق القائمة" onClick={() => setMenuOpen(false)} />}

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-start">
            <button className="menu-toggle icon-button" onClick={() => setMenuOpen(true)} aria-label="فتح القائمة">☰</button>
            <div className="breadcrumb"><span>الرئيسية</span><b>/</b><strong>{activeLabel}</strong></div>
          </div>
          <div className="topbar-actions">
            <button className="date-chip"><span>◷</span> ٣١ أكتوبر ٢٠٢٦</button>
            <button className="notification-button icon-button" aria-label="الإشعارات">♧<i /></button>
            <div className="topbar-avatar">م</div>
          </div>
        </header>

        <div className="page-container">
          <section className="welcome-row">
            <div>
              <div className="eyebrow"><span className="live-dot" /> لوحة تحكم الإدارة</div>
              <h1>مرحباً بك، مدير المنصة <span>👋</span></h1>
              <p>إليك ملخص أداء منصتك اليوم. نتمنى لك يوماً مليئاً بالإنجاز.</p>
            </div>
            <button className="primary-button" onClick={() => setActive('reports')}><span>＋</span> إنشاء تقرير</button>
          </section>

          <section className="stats-grid" aria-label="مؤشرات الأداء">
            {stats.map((stat) => (
              <article className="stat-card" key={stat.label}>
                <div className="stat-top">
                  <span className={`stat-icon ${stat.color}`}>{stat.icon}</span>
                  <span className="stat-change">{stat.change}</span>
                </div>
                <p className="stat-label">{stat.label}</p>
                <div className="stat-value">{stat.value}<small>{stat.unit}</small></div>
                <div className="stat-note">{stat.note}</div>
              </article>
            ))}
          </section>

          <section className="content-grid">
            <article className="panel chart-panel">
              <div className="panel-heading">
                <div><h2>نظرة على الإيرادات</h2><p>تحليل الإيرادات خلال آخر ٧ أشهر</p></div>
                <button className="select-chip">آخر ٧ أشهر <span>⌄</span></button>
              </div>
              <div className="chart-summary"><strong>٨,٤٥٠,٠٠٠ <small>ر.ي</small></strong><span className="positive">↑ ١٤.٥٪</span><span className="summary-caption">إجمالي الإيرادات</span></div>
              <div className="chart" role="img" aria-label="رسم بياني توضيحي للإيرادات خلال سبعة أشهر">
                <div className="chart-y-labels"><span>٢.٠ م</span><span>١.٥ م</span><span>١.٠ م</span><span>٠.٥ م</span><span>٠</span></div>
                <div className="chart-plot">
                  <div className="chart-grid-lines"><i /><i /><i /><i /><i /></div>
                  <svg viewBox="0 0 700 210" preserveAspectRatio="none" aria-hidden="true">
                    <defs><linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#b5d333" stopOpacity=".28" /><stop offset="100%" stopColor="#b5d333" stopOpacity="0" /></linearGradient></defs>
                    <path d="M0 166 C45 150 55 145 100 151 S160 130 200 137 S260 94 300 111 S365 91 400 99 S465 61 500 78 S560 49 600 58 S660 27 700 35 L700 210 L0 210 Z" fill="url(#areaFill)" />
                    <path d="M0 166 C45 150 55 145 100 151 S160 130 200 137 S260 94 300 111 S365 91 400 99 S465 61 500 78 S560 49 600 58 S660 27 700 35" fill="none" stroke="#78a92c" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                    <circle cx="700" cy="35" r="5" fill="#fff" stroke="#78a92c" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                  </svg>
                  <div className="chart-x-labels"><span>أبريل</span><span>مايو</span><span>يونيو</span><span>يوليو</span><span>أغسطس</span><span>سبتمبر</span><span>أكتوبر</span></div>
                </div>
              </div>
            </article>

            <article className="panel activity-panel">
              <div className="panel-heading"><div><h2>ملخص العمليات</h2><p>حالة العمليات لهذا الشهر</p></div><button className="more-button" aria-label="المزيد">•••</button></div>
              <div className="donut-wrap"><div className="donut"><div className="donut-center"><strong>٢٤٨</strong><span>عملية</span></div></div></div>
              <div className="legend">
                <div><i className="legend-dot completed" /><span>مكتملة</span><strong>١٨٦</strong><small>٧٥٪</small></div>
                <div><i className="legend-dot pending" /><span>قيد التنفيذ</span><strong>٤٣</strong><small>١٧٪</small></div>
                <div><i className="legend-dot cancelled" /><span>ملغاة</span><strong>١٩</strong><small>٨٪</small></div>
              </div>
            </article>
          </section>

          <section className="panel transactions-panel">
            <div className="panel-heading transactions-heading">
              <div><h2>أحدث العمليات</h2><p>تابع آخر المعاملات والطلبات على المنصة</p></div>
              <button className="text-button" onClick={() => setActive('orders')}>عرض جميع العمليات <span>←</span></button>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>رقم العملية</th><th>المتجر</th><th>التاريخ</th><th>المبلغ</th><th>الحالة</th><th /></tr></thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="transaction-id">{transaction.id}</td>
                      <td className="customer-cell"><span className="store-mini">م</span>{transaction.customer}</td>
                      <td className="date-cell">{transaction.date}</td>
                      <td className="amount-cell">{transaction.amount}</td>
                      <td><span className={`status-pill ${transaction.tone}`}>{transaction.status}</span></td>
                      <td><button className="row-more" aria-label={`خيارات العملية ${transaction.id}`}>•••</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <footer className="footer"><span>© ٢٠٢٦ MONEY TAKE. جميع الحقوق محفوظة.</span><span>صُنع لإدارة أعمال أكثر ذكاءً <b>♥</b></span></footer>
        </div>
      </main>
    </div>
  )
}

export default App