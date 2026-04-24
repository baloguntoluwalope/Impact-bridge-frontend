import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MdAdd, MdDelete, MdEdit, MdVisibility, MdPublish } from 'react-icons/md';
import toast from 'react-hot-toast';
import api from '../../services/api';
import sdgService from '../../services/sdgService';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import Select from '../../components/common/Select';
import { TableSkeleton } from '../../components/common/Loader';
import Empty from '../../components/common/Empty';
import Badge from '../../components/common/Badge';
import { ago } from '../../utils/helpers';
import { SDG } from '../../utils/constants';

const fetchAllContent = (sdgNum, page) =>
  api.get(`/sdg/${sdgNum || 1}/content`, { params: { page, limit: 15 } }).then(r => r.data);

const createContent = (body) => api.post('/sdg/content', body).then(r => r.data);
const deleteContent = (id) => api.delete(`/sdg/content/${id}`).then(r => r.data);
const updateContent = ({ id, body }) => api.patch(`/sdg/content/${id}`, body).then(r => r.data);

export default function AdminSDGContent() {
  const qc = useQueryClient();
  const [selSDG, setSelSDG]     = useState(1);
  const [page,   setPage]       = useState(1);
  const [modal,  setModal]      = useState(false);
  const [form,   setForm]       = useState({ title:'', body:'', content_type:'text', sdg_number:1, is_published:false, target_audience:'all', language:'en' });

  const { data, isLoading } = useQuery({
    queryKey: ['sdg-content-admin', selSDG, page],
    queryFn:  () => fetchAllContent(selSDG, page),
    staleTime: 60000,
  });

  const content = data?.data || [];
  const pgn     = data?.pagination || {};

  const inv = () => qc.invalidateQueries(['sdg-content-admin']);

  const { mutate: doCreate, isLoading: creating } = useMutation({ mutationFn: createContent, onSuccess: () => { toast.success('Content created!'); setModal(false); inv(); }, onError: e => toast.error(e?.response?.data?.message||'Failed') });
  const { mutate: doDelete } = useMutation({ mutationFn: deleteContent, onSuccess: () => { toast.success('Deleted'); inv(); }, onError: e => toast.error(e?.response?.data?.message||'Failed') });
  const { mutate: doToggle } = useMutation({ mutationFn: updateContent, onSuccess: () => { toast.success('Updated'); inv(); } });

  return (
    <>
      <Helmet><title>SDG Content — Impact Bridge Admin</title></Helmet>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:16 }}>
        <div>
          <h1 style={{ fontSize:24, fontWeight:800, color:'#0d0f14', letterSpacing:'-.4px', marginBottom:4 }}>SDG Content CMS</h1>
          <p style={{ fontSize:13, color:'#64748b' }}>Manage educational content for all 17 SDG goals.</p>
        </div>
        <Button icon={<MdAdd size={17} />} onClick={() => { setModal(true); setForm(f => ({ ...f, sdg_number: selSDG })); }}>
          Add Content
        </Button>
      </div>

      {/* SDG selector */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:20 }}>
        {Object.entries(SDG).map(([n, d]) => (
          <button key={n} onClick={() => { setSelSDG(+n); setPage(1); }}
            style={{
              display:'flex', alignItems:'center', gap:6, padding:'7px 14px',
              borderRadius:999, fontSize:12, fontWeight:600, cursor:'pointer',
              border:`1.5px solid ${selSDG===+n ? d.color : '#e2e8f0'}`,
              background: selSDG===+n ? `${d.color}12` : '#fff',
              color:      selSDG===+n ? d.color : '#64748b',
              transition: 'all 140ms',
            }}>
            <span>{d.icon}</span>
            <span>SDG {n}</span>
          </button>
        ))}
      </div>

      {/* Selected SDG header */}
      {SDG[selSDG] && (
        <div style={{ display:'flex', alignItems:'center', gap:14, background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, padding:'16px 20px', marginBottom:20 }}>
          <div style={{ width:50, height:50, borderRadius:12, background:`${SDG[selSDG].color}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28 }}>
            {SDG[selSDG].icon}
          </div>
          <div>
            <p style={{ fontWeight:700, fontSize:15, color:'#0d0f14' }}>SDG {selSDG}: {SDG[selSDG].title}</p>
            <p style={{ fontSize:12, color:'#64748b', marginTop:2 }}>{pgn.total || 0} content items</p>
          </div>
        </div>
      )}

      {isLoading ? <TableSkeleton rows={6} /> : content.length > 0 ? (
        <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                {['Title','Type','Audience','Language','Status','Added','Actions'].map(h => (
                  <th key={h} style={{ padding:'10px 18px', textAlign:'left', fontSize:10, fontWeight:700, color:'#94a3b8', background:'#f8fafc', borderBottom:'1px solid #f1f5f9', textTransform:'uppercase', letterSpacing:'.07em', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {content.map((c, i) => (
                <tr key={c._id} style={{ borderBottom: i<content.length-1 ? '1px solid #f8fafc' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background='#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'12px 18px', maxWidth:240 }}>
                    <p style={{ fontWeight:700, fontSize:13, color:'#0d0f14', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.title}</p>
                  </td>
                  <td style={{ padding:'12px 18px' }}>
                    <span style={{ fontSize:11, fontWeight:700, color:'#3b82f6', background:'#eff6ff', padding:'2px 8px', borderRadius:5, textTransform:'capitalize' }}>{c.content_type}</span>
                  </td>
                  <td style={{ padding:'12px 18px', fontSize:12, color:'#64748b', textTransform:'capitalize' }}>{c.target_audience}</td>
                  <td style={{ padding:'12px 18px', fontSize:12, color:'#64748b', textTransform:'uppercase' }}>{c.language || 'EN'}</td>
                  <td style={{ padding:'12px 18px' }}>
                    {c.is_published
                      ? <span style={{ fontSize:11, fontWeight:700, color:'#10b981', background:'#ecfdf5', padding:'2px 8px', borderRadius:5 }}>Published</span>
                      : <span style={{ fontSize:11, fontWeight:700, color:'#f59e0b', background:'#fffbeb', padding:'2px 8px', borderRadius:5 }}>Draft</span>
                    }
                  </td>
                  <td style={{ padding:'12px 18px', fontSize:11, color:'#94a3b8', whiteSpace:'nowrap' }}>{ago(c.created_at)}</td>
                  <td style={{ padding:'12px 18px' }}>
                    <div style={{ display:'flex', gap:6 }}>
                      <button title={c.is_published ? 'Unpublish' : 'Publish'}
                        onClick={() => doToggle({ id:c._id, body:{ is_published:!c.is_published } })}
                        style={{ width:30, height:30, borderRadius:7, background: c.is_published ? '#fffbeb' : '#ecfdf5', color: c.is_published ? '#f59e0b' : '#10b981', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', border:'none' }}>
                        {c.is_published ? <MdVisibility size={15} /> : <MdPublish size={15} />}
                      </button>
                      <button title="Delete"
                        onClick={() => { if (window.confirm('Delete this content?')) doDelete(c._id); }}
                        style={{ width:30, height:30, borderRadius:7, background:'#fef2f2', color:'#ef4444', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', border:'none' }}>
                        <MdDelete size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty icon={SDG[selSDG]?.icon || '📚'} title={`No content for SDG ${selSDG}`}
          message="Add educational content for this SDG goal."
          action={() => { setModal(true); setForm(f => ({ ...f, sdg_number: selSDG })); }}
          actionLabel="Add First Content" />
      )}

      {/* Create Modal */}
      <Modal isOpen={modal} onClose={() => setModal(false)} title="Add SDG Content" size="md">
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <Select label="SDG Goal" required value={String(form.sdg_number)} onChange={e => setForm(f => ({ ...f, sdg_number: +e.target.value }))}>
            {Object.entries(SDG).map(([n,d]) => <option key={n} value={n}>SDG {n} — {d.title}</option>)}
          </Select>
          <Input label="Title" required placeholder="e.g. Why Education Matters in Nigeria"
            value={form.title} onChange={e => setForm(f => ({ ...f, title:e.target.value }))} />
          <Textarea label="Content Body" required rows={6} placeholder="Educational content…"
            value={form.body} onChange={e => setForm(f => ({ ...f, body:e.target.value }))} />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
            <Select label="Type" value={form.content_type} onChange={e => setForm(f => ({ ...f, content_type:e.target.value }))}>
              {['text','video','audio','pdf','infographic','quiz'].map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
            <Select label="Audience" value={form.target_audience} onChange={e => setForm(f => ({ ...f, target_audience:e.target.value }))}>
              {['all','students','teachers','community','ngo','government','donor'].map(a => <option key={a} value={a}>{a}</option>)}
            </Select>
            <Select label="Language" value={form.language} onChange={e => setForm(f => ({ ...f, language:e.target.value }))}>
              {['en','ha','yo','ig'].map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
            </Select>
          </div>
          <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', fontSize:13, color:'#475569' }}>
            <input type="checkbox" checked={form.is_published} onChange={e => setForm(f => ({ ...f, is_published:e.target.checked }))}
              style={{ width:16, height:16, accentColor:'#e85d04' }} />
            Publish immediately (visible to public)
          </label>
          <Button loading={creating} fullWidth onClick={() => doCreate(form)}>Create Content</Button>
        </div>
      </Modal>
    </>
  );
}