import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase, supabaseConfigured } from './lib/supabase'
import './index.css'

type Row = Record<string, unknown>
type Section = 'overview' | 'orders' | 'stores' | 'finance' | 'claims'
const nav: {id:Section;label:string}[] = [
  {id:'overview',label:'نظرة عامة'},
  {id:'orders',label:'الطلبات'},
  {id:'stores',label:'المتاجر'},
  {id:'finance',label:'المالية'},
  {id:'claims',label:'المطالبات'},
]
const tables: Record<Exclude<Section,'overview'>,{table:string;title:string;columns:string[]}> = {
  orders:{table:'orders',title:'الطلبات',columns:['order_number','status','total_amount','currency','created_at']},
  stores:{table:'stores',title:'المتاجر',columns:['name','status','contact_phone','email','created_at']},
  finance:{table:'transactions',title:'المعاملات المالية',columns:['type','status','amount','currency','reference','created_at']},
  claims:{table:'claims',title:'المطالبات',columns:['subject','status','description','resolution','created_at']},
}
const labels:Record<string,string> = {
  order_number:'رقم الطلب',status:'الحالة',total_amount:'المبلغ',currency:'العملة',created_at:'تاريخ الإنشاء',
  name:'اسم المتجر',contact_phone:'الهاتف',email:'البريد الإلكتروني',type:'النوع',amount:'المبلغ',
  reference:'المرجع',subject:'الموضوع',description:'التفاصيل',resolution:'المعالجة',
}
function display(value:unknown) {
  if(value===null || value===undefined || value==='') return '—'
  if(typeof value==='object') return JSON.stringify(value)
  return String(value)
}
export default function ConnectedApp() {
  const [session,setSession]=useState<Session|null>(null)
  const [section,setSection]=useState<Section>('overview')
  const [rows,setRows]=useState<Row[]>([])
  const [counts,setCounts]=useState<Record<string,number>>({})
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [authBusy,setAuthBusy]=useState(false)
  const [role,setRole]=useState('customer')
  const [fullName,setFullName]=useState('')

  useEffect(()=>{
    if(!supabase) { setLoading(false); return }
    supabase.auth.getSession().then(({data})=>setSession(data.session))
    const client = supabase
    if (!client) return
    const {data:{subscription}}=client.auth.onAuthStateChange((_event,next)=>setSession(next))
    return ()=>subscription.unsubscribe()
  },[])

  useEffect(()=>{
    let alive=true
    async function loadProfile(){
      if(!supabase || !session?.user) {setRole('customer');setFullName('');return}
      const {data,error:profileError}=await supabase.from('profiles').select('role,full_name').eq('id',session.user.id).maybeSingle()
      if(!alive)return
      if(profileError){setError(profileError.message);return}
      setRole(data?.role ?? 'customer')
      setFullName(data?.full_name ?? session.user.email ?? '')
    }
    loadProfile()
    return ()=>{alive=false}
  },[session])

  const loadData=useCallback(async()=>{
    if(!supabase || !session) return
    const client = supabase
    setLoading(true);setError('')
    const target=section==='overview'?'orders':tables[section].table
    const {data,error:queryError}=await client.from(target).select('*').order('created_at',{ascending:false}).limit(50)
    if(queryError){setError(queryError.message);setRows([])} else setRows((data??[]) as Row[])
    if(section==='overview'){
      const names=['orders','stores','transactions','claims']
      const results=await Promise.all(names.map(async name=>{
        const {count,error:countError}=await client.from(name).select('*',{count:'exact',head:true})
        return [name,countError?null:(count??0)] as const
      }))
      setCounts(Object.fromEntries(results.map(([name,count])=>[name,count ?? 0])))
    }
    setLoading(false)
  },[section,session])
  useEffect(()=>{loadData()},[loadData])

  async function signIn(e:FormEvent){
    e.preventDefault();if(!supabase)return
    setAuthBusy(true);setError('')
    const {error:loginError}=await supabase.auth.signInWithPassword({email,password})
    if(loginError)setError(loginError.message)
    setAuthBusy(false)
  }
  async function signOut(){if(supabase)await supabase.auth.signOut()}

  if(!supabaseConfigured) return <main dir="rtl" style={styles.center}><section style={styles.card}><h1>MONEY TAKE</h1><h2>إعداد الاتصال بقاعدة البيانات</h2><p>أضف متغيري Vercel التاليين إلى بيئتي Production وPreview ثم أعد النشر:</p><code>VITE_SUPABASE_URL</code><code>VITE_SUPABASE_PUBLISHABLE_KEY</code><p>عنوان المشروع مضبوط في ملف الإعدادات النموذجي. أضف مفتاح النشر العام من Supabase في Vercel.</p></section></main>
  if(!session) return <main dir="rtl" style={styles.center}><form style={styles.card} onSubmit={signIn}><h1>MONEY TAKE</h1><h2>تسجيل الدخول</h2><p>سجّل الدخول للوصول إلى بيانات المنصة.</p><label>البريد الإلكتروني<input style={styles.input} type="email" required value={email} onChange={e=>setEmail(e.target.value)} /></label><label>كلمة المرور<input style={styles.input} type="password" required value={password} onChange={e=>setPassword(e.target.value)} /></label><button style={styles.button} disabled={authBusy}>{authBusy?'جارٍ الدخول…':'دخول'}</button>{error&&<p style={styles.error}>{error}</p>}</form></main>

  const activeTable=section==='overview'?null:tables[section]
  const metricNames=[['orders','الطلبات'],['stores','المتاجر'],['transactions','المعاملات'],['claims','المطالبات']]
  return <div dir="rtl" style={styles.shell}>
    <aside style={styles.sidebar}><h2>MONEY TAKE</h2><p>إدارة أعمالك بوضوح</p><nav>{nav.map(item=><button key={item.id} onClick={()=>setSection(item.id)} style={{...styles.nav,...(section===item.id?styles.navActive:{})}}>{item.label}</button>)}</nav><div style={styles.user}><b>{fullName||session.user.email}</b><small>{role==='admin'?'مدير المنصة':role==='store'?'إدارة متجر':'عميل'}</small><button onClick={signOut} style={styles.logout}>تسجيل الخروج</button></div></aside>
    <main style={styles.main}><header style={styles.header}><div><small>لوحة التحكم / {nav.find(n=>n.id===section)?.label}</small><h1>{section==='overview'?'نظرة عامة':activeTable?.title}</h1></div><button onClick={loadData} style={styles.refresh}>تحديث البيانات</button></header>
      {error&&<p style={styles.error}>{error}</p>}
      {section==='overview'&&<><div style={styles.metrics}>{metricNames.map(([key,label])=><article key={key} style={styles.metric}><small>{label}</small><strong>{counts[key]??'—'}</strong><span>سجل في قاعدة البيانات</span></article>)}</div><h2>أحدث الطلبات</h2></>}
      {activeTable&&<h2>{activeTable.title}</h2>}
      {loading?<p>جارٍ تحميل البيانات…</p>:<div style={styles.tableWrap}><table style={styles.table}><thead><tr>{(section==='overview'?tables.orders.columns:activeTable!.columns).map(col=><th key={col}>{labels[col]??col}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={String(row.id??i)}>{(section==='overview'?tables.orders.columns:activeTable!.columns).map(col=><td key={col}>{display(row[col])}</td>)}</tr>)}</tbody></table>{rows.length===0&&<p style={{padding:20}}>لا توجد سجلات متاحة للعرض حاليًا.</p>}</div>}
      <p style={styles.notice}>تعرض هذه الصفحة البيانات التي تسمح بها صلاحيات حسابك في Supabase. لا توجد أرقام تجريبية.</p>
    </main>
  </div>
}
const styles:Record<string,React.CSSProperties>={
 center:{minHeight:'100vh',display:'grid',placeItems:'center',background:'#f4f7f3',padding:20,fontFamily:'inherit'},
 card:{width:'min(100%,420px)',background:'#fff',padding:28,borderRadius:18,boxShadow:'0 12px 40px #102b1614',display:'grid',gap:14},
 input:{display:'block',width:'100%',padding:12,marginTop:7,border:'1px solid #dce5dc',borderRadius:9,font:'inherit',boxSizing:'border-box'},
 button:{background:'#134e2a',color:'#fff',border:0,padding:13,borderRadius:9,font:'inherit',cursor:'pointer'},
 error:{color:'#b42318',background:'#fff0ef',padding:12,borderRadius:8,overflowWrap:'anywhere'},
 shell:{minHeight:'100vh',display:'grid',gridTemplateColumns:'240px 1fr',background:'#f5f7f4',color:'#17251b',fontFamily:'inherit'},
 sidebar:{background:'#103f25',color:'#fff',padding:22,display:'flex',flexDirection:'column',gap:8},
 nav:{display:'block',width:'100%',textAlign:'right',padding:'13px 12px',border:0,borderRadius:9,background:'transparent',color:'#e3eee5',font:'inherit',cursor:'pointer',marginTop:5},
 navActive:{background:'#b5d333',color:'#143b22',fontWeight:700},
 user:{marginTop:'auto',paddingTop:22,display:'grid',gap:8,overflowWrap:'anywhere'},
 logout:{background:'transparent',color:'#fff',border:'1px solid #ffffff55',padding:10,borderRadius:8,font:'inherit'},
 main:{padding:28,minWidth:0},header:{display:'flex',justifyContent:'space-between',alignItems:'center',gap:16,marginBottom:24},
 refresh:{padding:'10px 14px',background:'#fff',border:'1px solid #dce5dc',borderRadius:9,font:'inherit'},
 metrics:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:14,marginBottom:28},
 metric:{background:'#fff',padding:20,borderRadius:14,display:'grid',gap:8,boxShadow:'0 3px 14px #152b1510'},
 tableWrap:{overflowX:'auto',background:'#fff',borderRadius:14},table:{width:'100%',borderCollapse:'collapse',textAlign:'right',whiteSpace:'nowrap'},
 notice:{color:'#657568',fontSize:13,marginTop:22}
}
