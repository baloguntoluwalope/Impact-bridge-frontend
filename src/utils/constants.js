// Universal safety check for environment variables
const env = (typeof process !== 'undefined' && process.env) ? process.env : {};

export const API_URL = env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';
export const WA_PHONE = env.REACT_APP_WHATSAPP || '2348012345678';

export const ROLES = {
  INDIVIDUAL: 'individual',
  STUDENT: 'student',
  SCHOOL: 'school_admin',
  COMMUNITY: 'community_leader',
  NGO: 'ngo_partner',
  DONOR: 'donor',
  GOVERNMENT: 'government_official',
  CORPORATE: 'corporate',
  ADMIN: 'super_admin',
};

export const STATUS = {
  draft: { label: 'Draft', color: '#6B7280', bg: '#F3F4F6' },
  submitted: { label: 'Submitted', color: '#3B82F6', bg: '#EFF6FF' },
  under_review: { label: 'Under Review', color: '#F59E0B', bg: '#FFFBEB' },
  verified: { label: 'Verified', color: '#10B981', bg: '#ECFDF5' },
  rejected: { label: 'Rejected', color: '#EF4444', bg: '#FEF2F2' },
  funded: { label: 'Funded', color: '#8B5CF6', bg: '#F5F3FF' },
  in_progress: { label: 'In Progress', color: '#F97316', bg: '#FFF7ED' },
  completed: { label: 'Completed', color: '#059669', bg: '#ECFDF5' },
  cancelled: { label: 'Cancelled', color: '#9CA3AF', bg: '#F9FAFB' },
  pending_approval: { label: 'Pending', color: '#F59E0B', bg: '#FFFBEB' },
  approved: { label: 'Approved', color: '#10B981', bg: '#ECFDF5' },
};

export const SDG = {
  1: { title: 'No Poverty', color: '#E5243B', icon: '🌍', cat: 'no_poverty' },
  2: { title: 'Zero Hunger', color: '#DDA63A', icon: '🌾', cat: 'zero_hunger' },
  3: { title: 'Good Health', color: '#4C9F38', icon: '🏥', cat: 'good_health' },
  4: { title: 'Quality Education', color: '#C5192D', icon: '📚', cat: 'quality_education' },
  5: { title: 'Gender Equality', color: '#FF3A21', icon: '⚖️', cat: 'gender_equality' },
  6: { title: 'Clean Water', color: '#26BDE2', icon: '💧', cat: 'clean_water' },
  7: { title: 'Clean Energy', color: '#FCC30B', icon: '⚡', cat: 'affordable_energy' },
  8: { title: 'Decent Work', color: '#A21942', icon: '💼', cat: 'decent_work' },
  9: { title: 'Industry & Innovation', color: '#FD6925', icon: '🏗️', cat: 'industry_innovation' },
  10: { title: 'Reduced Inequalities', color: '#DD1367', icon: '🤝', cat: 'reduced_inequalities' },
  11: { title: 'Sustainable Cities', color: '#FD9D24', icon: '🏙️', cat: 'sustainable_cities' },
  12: { title: 'Responsible Consumption', color: '#BF8B2E', icon: '♻️', cat: 'responsible_consumption' },
  13: { title: 'Climate Action', color: '#3F7E44', icon: '🌿', cat: 'climate_action' },
  14: { title: 'Life Below Water', color: '#0A97D9', icon: '🐠', cat: 'life_below_water' },
  15: { title: 'Life on Land', color: '#56C02B', icon: '🌳', cat: 'life_on_land' },
  16: { title: 'Peace & Justice', color: '#00689D', icon: '🕊️', cat: 'peace_justice' },
  17: { title: 'Partnerships', color: '#19486A', icon: '🤲', cat: 'partnerships' },
};

export const STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT Abuja', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara',
];

export const SDG_CATS = Object.entries(SDG).map(([n, d]) => ({
  value: d.cat, label: `SDG ${n} — ${d.title}`, num: +n, color: d.color, icon: d.icon,
}));

export const URGENCY = [
  { value: 'low', label: 'Low', color: '#10B981', bg: '#ECFDF5' },
  { value: 'medium', label: 'Medium', color: '#F59E0B', bg: '#FFFBEB' },
  { value: 'high', label: 'High', color: '#F97316', bg: '#FFF7ED' },
  { value: 'critical', label: 'Critical', color: '#EF4444', bg: '#FEF2F2' },
];

export const FUND_TYPES = [
  { value: 'case_funding', label: 'Case Funding' },
  { value: 'student_sponsorship', label: 'Student Sponsorship' },
  { value: 'school_funding', label: 'School Funding' },
  { value: 'community_project', label: 'Community Project' },
  { value: 'sdg_club', label: 'SDG Club' },
  { value: 'general_impact', label: 'General Impact Fund' },
];

export const GATEWAYS = [
  { value: 'korapay', label: 'Korapay', rec: true },
  { value: 'paystack', label: 'Paystack', rec: false },
  { value: 'flutterwave', label: 'Flutterwave', rec: false },
];

export const PRESETS = [1000, 5000, 10000, 25000, 50000, 100000];

export const SORTS = [
  { value: '-created_at', label: 'Newest First' },
  { value: '-amount_raised', label: 'Most Funded' },
  { value: '-donor_count', label: 'Most Popular' },
  { value: 'amount_needed', label: 'Smallest Goal' },
];

export const ROLE_OPTIONS = [
  { value: 'donor', label: '💰 Donor — I want to fund causes' },
  { value: 'individual', label: '👤 Individual — I need assistance' },
  { value: 'student', label: '🎓 Student' },
  { value: 'school_admin', label: '🏫 School Admin' },
  { value: 'community_leader', label: '👥 Community Leader' },
  { value: 'ngo_partner', label: '🏢 NGO Partner' },
  { value: 'corporate', label: '🏛️ Corporate (CSR)' },
  { value: 'government_official', label: '🏛️ Government Official' },
];



// export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';
// export const WA_PHONE = process.env.REACT_APP_WHATSAPP || '2348012345678';

// export const ROLES = {
//   INDIVIDUAL:  'individual',   STUDENT:     'student',
//   SCHOOL:      'school_admin', COMMUNITY:   'community_leader',
//   NGO:         'ngo_partner',  DONOR:       'donor',
//   GOVERNMENT:  'government_official',
//   CORPORATE:   'corporate',    ADMIN:       'super_admin',
// };

// export const STATUS = {
//   draft:            { label:'Draft',        color:'#6B7280', bg:'#F3F4F6' },
//   submitted:        { label:'Submitted',    color:'#3B82F6', bg:'#EFF6FF' },
//   under_review:     { label:'Under Review', color:'#F59E0B', bg:'#FFFBEB' },
//   verified:         { label:'Verified',     color:'#10B981', bg:'#ECFDF5' },
//   rejected:         { label:'Rejected',     color:'#EF4444', bg:'#FEF2F2' },
//   funded:           { label:'Funded',       color:'#8B5CF6', bg:'#F5F3FF' },
//   in_progress:      { label:'In Progress',  color:'#F97316', bg:'#FFF7ED' },
//   completed:        { label:'Completed',    color:'#059669', bg:'#ECFDF5' },
//   cancelled:        { label:'Cancelled',    color:'#9CA3AF', bg:'#F9FAFB' },
//   pending_approval: { label:'Pending',      color:'#F59E0B', bg:'#FFFBEB' },
//   approved:         { label:'Approved',     color:'#10B981', bg:'#ECFDF5' },
// };

// export const SDG = {
//   1:  { title:'No Poverty',                   color:'#E5243B', icon:'🌍', cat:'no_poverty' },
//   2:  { title:'Zero Hunger',                  color:'#DDA63A', icon:'🌾', cat:'zero_hunger' },
//   3:  { title:'Good Health',                  color:'#4C9F38', icon:'🏥', cat:'good_health' },
//   4:  { title:'Quality Education',            color:'#C5192D', icon:'📚', cat:'quality_education' },
//   5:  { title:'Gender Equality',              color:'#FF3A21', icon:'⚖️', cat:'gender_equality' },
//   6:  { title:'Clean Water',                  color:'#26BDE2', icon:'💧', cat:'clean_water' },
//   7:  { title:'Clean Energy',                 color:'#FCC30B', icon:'⚡', cat:'affordable_energy' },
//   8:  { title:'Decent Work',                  color:'#A21942', icon:'💼', cat:'decent_work' },
//   9:  { title:'Industry & Innovation',        color:'#FD6925', icon:'🏗️', cat:'industry_innovation' },
//   10: { title:'Reduced Inequalities',         color:'#DD1367', icon:'🤝', cat:'reduced_inequalities' },
//   11: { title:'Sustainable Cities',           color:'#FD9D24', icon:'🏙️', cat:'sustainable_cities' },
//   12: { title:'Responsible Consumption',      color:'#BF8B2E', icon:'♻️', cat:'responsible_consumption' },
//   13: { title:'Climate Action',               color:'#3F7E44', icon:'🌿', cat:'climate_action' },
//   14: { title:'Life Below Water',             color:'#0A97D9', icon:'🐠', cat:'life_below_water' },
//   15: { title:'Life on Land',                 color:'#56C02B', icon:'🌳', cat:'life_on_land' },
//   16: { title:'Peace & Justice',              color:'#00689D', icon:'🕊️', cat:'peace_justice' },
//   17: { title:'Partnerships',                 color:'#19486A', icon:'🤲', cat:'partnerships' },
// };

// export const STATES = [
//   'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
//   'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT Abuja','Gombe',
//   'Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos',
//   'Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto',
//   'Taraba','Yobe','Zamfara',
// ];

// export const SDG_CATS = Object.entries(SDG).map(([n, d]) => ({
//   value: d.cat, label: `SDG ${n} — ${d.title}`, num: +n, color: d.color, icon: d.icon,
// }));

// export const URGENCY = [
//   { value:'low',      label:'Low',      color:'#10B981', bg:'#ECFDF5' },
//   { value:'medium',   label:'Medium',   color:'#F59E0B', bg:'#FFFBEB' },
//   { value:'high',     label:'High',     color:'#F97316', bg:'#FFF7ED' },
//   { value:'critical', label:'Critical', color:'#EF4444', bg:'#FEF2F2' },
// ];

// export const FUND_TYPES = [
//   { value:'case_funding',        label:'Case Funding' },
//   { value:'student_sponsorship', label:'Student Sponsorship' },
//   { value:'school_funding',      label:'School Funding' },
//   { value:'community_project',   label:'Community Project' },
//   { value:'sdg_club',            label:'SDG Club' },
//   { value:'general_impact',      label:'General Impact Fund' },
// ];

// export const GATEWAYS = [
//   { value:'korapay',     label:'Korapay',     rec:true },
//   { value:'paystack',    label:'Paystack',    rec:false },
//   { value:'flutterwave', label:'Flutterwave', rec:false },
// ];

// export const PRESETS = [1000, 5000, 10000, 25000, 50000, 100000];

// export const SORTS = [
//   { value:'-created_at',  label:'Newest First' },
//   { value:'-amount_raised', label:'Most Funded' },
//   { value:'-donor_count', label:'Most Popular' },
//   { value:'amount_needed', label:'Smallest Goal' },
// ];

// export const ROLE_OPTIONS = [
//   { value:'donor',               label:'💰 Donor — I want to fund causes' },
//   { value:'individual',          label:'👤 Individual — I need assistance' },
//   { value:'student',             label:'🎓 Student' },
//   { value:'school_admin',        label:'🏫 School Admin' },
//   { value:'community_leader',    label:'👥 Community Leader' },
//   { value:'ngo_partner',         label:'🏢 NGO Partner' },
//   { value:'corporate',           label:'🏛️ Corporate (CSR)' },
//   { value:'government_official', label:'🏛️ Government Official' },
// ];