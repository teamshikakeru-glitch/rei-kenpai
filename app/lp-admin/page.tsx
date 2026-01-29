'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type Project = {
  id: string
  project_name: string
  status: string
  revision_count: number
  price: number
  notes: string | null
  created_at: string
  completed_at: string | null
  client: {
    id: string
    company_name: string
    contact_name: string
    email: string
    phone: string | null
  }
  intake_form: {
    service_name: string
    industry: string
    purpose: string
    target_audience: string
    features: string[]
    achievements: string | null
    pain_points: string | null
    cta_url: string
    contact_info: string | null
    design_mood: string | null
    reference_url: string | null
    notes: string | null
  } | null
}

const statuses = ['受付', '制作中', '確認待ち', '修正中', '完了', 'キャンセル']

const statusColors: Record<string, string> = {
  '受付': '#ffc107',
  '制作中': '#00a8cc',
  '確認待ち': '#9c27b0',
  '修正中': '#ff6b6b',
  '完了': '#00d4aa',
  'キャンセル': '#6b7280',
}

export default function LPAdminPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [editingNotes, setEditingNotes] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)

  const fetchProjects = async () => {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('lp_projects')
      .select(`
        *,
        client:lp_clients(*),
        intake_form:lp_intake_forms(*)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects:', error)
      return
    }

    setProjects(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const updateStatus = async (projectId: string, newStatus: string) => {
    const supabase = createClient()
    
    const updateData: Record<string, unknown> = { status: newStatus }
    if (newStatus === '完了') {
      updateData.completed_at = new Date().toISOString()
    }

    const { error } = await supabase
      .from('lp_projects')
      .update(updateData)
      .eq('id', projectId)

    if (error) {
      console.error('Error updating status:', error)
      return
    }

    fetchProjects()
    if (selectedProject?.id === projectId) {
      setSelectedProject(prev => prev ? { ...prev, status: newStatus } : null)
    }
  }

  const incrementRevision = async (projectId: string, currentCount: number) => {
    if (currentCount >= 3) {
      if (!confirm('修正回数が上限（3回）を超えます。追加料金が発生しますがよろしいですか？')) {
        return
      }
    }

    const supabase = createClient()
    
    const { error } = await supabase
      .from('lp_projects')
      .update({ revision_count: currentCount + 1 })
      .eq('id', projectId)

    if (error) {
      console.error('Error updating revision count:', error)
      return
    }

    fetchProjects()
    if (selectedProject?.id === projectId) {
      setSelectedProject(prev => prev ? { ...prev, revision_count: currentCount + 1 } : null)
    }
  }

  const saveNotes = async (projectId: string) => {
    setSavingNotes(true)
    const supabase = createClient()
    
    const { error } = await supabase
      .from('lp_projects')
      .update({ notes: editingNotes })
      .eq('id', projectId)

    if (error) {
      console.error('Error saving notes:', error)
    } else {
      fetchProjects()
      if (selectedProject) {
        setSelectedProject({ ...selectedProject, notes: editingNotes })
      }
    }
    setSavingNotes(false)
  }

  const getDaysElapsed = (dateString: string) => {
    const created = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - created.getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap');
    
    .lp-admin * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    .lp-admin {
      font-family: 'Zen Kaku Gothic New', 'Outfit', sans-serif !important;
      min-height: 100vh;
      background: linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%);
      color: #ffffff;
      line-height: 1.6;
    }
    
    .lp-admin-header {
      padding: 24px 32px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .lp-admin-title {
      font-size: 24px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .lp-admin-title-badge {
      background: linear-gradient(135deg, #00d4aa 0%, #00a8cc 100%);
      padding: 4px 12px;
      border-radius: 100px;
      font-size: 12px;
      font-weight: 600;
    }
    
    .lp-admin-header-left {
      display: flex;
      align-items: center;
      gap: 24px;
    }
    
    .lp-admin-form-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: rgba(102, 126, 234, 0.2);
      border: 1px solid rgba(102, 126, 234, 0.4);
      border-radius: 10px;
      color: #a5b4fc;
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    
    .lp-admin-form-link:hover {
      background: rgba(102, 126, 234, 0.3);
      border-color: rgba(102, 126, 234, 0.6);
      color: #c7d2fe;
    }
    
    .lp-admin-stats {
      display: flex;
      gap: 24px;
    }
    
    .lp-admin-stat {
      text-align: center;
    }
    
    .lp-admin-stat-value {
      font-size: 28px;
      font-weight: 700;
      color: #00d4aa;
    }
    
    .lp-admin-stat-label {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
    }
    
    .lp-admin-content {
      display: flex;
      height: calc(100vh - 81px);
    }
    
    .lp-admin-list {
      width: 480px;
      border-right: 1px solid rgba(255, 255, 255, 0.06);
      overflow-y: auto;
    }
    
    .lp-admin-list-header {
      padding: 16px 24px;
      background: rgba(255, 255, 255, 0.02);
      font-size: 12px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.5);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      position: sticky;
      top: 0;
      backdrop-filter: blur(10px);
    }
    
    .lp-admin-item {
      padding: 20px 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .lp-admin-item:hover {
      background: rgba(255, 255, 255, 0.03);
    }
    
    .lp-admin-item.active {
      background: rgba(0, 212, 170, 0.1);
      border-left: 3px solid #00d4aa;
    }
    
    .lp-admin-item-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }
    
    .lp-admin-item-company {
      font-size: 16px;
      font-weight: 600;
    }
    
    .lp-admin-item-status {
      padding: 4px 10px;
      border-radius: 100px;
      font-size: 11px;
      font-weight: 600;
    }
    
    .lp-admin-item-service {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 8px;
    }
    
    .lp-admin-item-meta {
      display: flex;
      gap: 16px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.4);
    }
    
    .lp-admin-item-days {
      color: #00d4aa;
      font-weight: 500;
    }
    
    .lp-admin-item-revision {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .lp-admin-item-revision.warning {
      color: #ff6b6b;
    }
    
    .lp-admin-detail {
      flex: 1;
      overflow-y: auto;
      padding: 32px;
    }
    
    .lp-admin-detail-empty {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: rgba(255, 255, 255, 0.3);
      font-size: 16px;
    }
    
    .lp-admin-detail-header {
      margin-bottom: 32px;
    }
    
    .lp-admin-detail-title {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    
    .lp-admin-detail-subtitle {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.6);
    }
    
    .lp-admin-detail-actions {
      display: flex;
      gap: 12px;
      margin-bottom: 32px;
      flex-wrap: wrap;
    }
    
    .lp-admin-status-select {
      padding: 12px 20px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: #ffffff;
      font-size: 14px;
      font-family: inherit;
      cursor: pointer;
      outline: none;
      min-width: 160px;
    }
    
    .lp-admin-status-select:focus {
      border-color: rgba(0, 212, 170, 0.5);
    }
    
    .lp-admin-status-select option {
      background: #1a1a2e;
    }
    
    .lp-admin-btn {
      padding: 12px 24px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .lp-admin-btn-revision {
      background: rgba(255, 107, 107, 0.2);
      color: #ff6b6b;
      border: 1px solid rgba(255, 107, 107, 0.3);
    }
    
    .lp-admin-btn-revision:hover {
      background: rgba(255, 107, 107, 0.3);
    }
    
    .lp-admin-section {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
    }
    
    .lp-admin-section-title {
      font-size: 14px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.5);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .lp-admin-info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    
    .lp-admin-info-item {
      padding: 16px;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 12px;
    }
    
    .lp-admin-info-item.full {
      grid-column: span 2;
    }
    
    .lp-admin-info-label {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.4);
      margin-bottom: 4px;
    }
    
    .lp-admin-info-value {
      font-size: 15px;
      color: #ffffff;
      word-break: break-all;
    }
    
    .lp-admin-info-value a {
      color: #00d4aa;
      text-decoration: none;
    }
    
    .lp-admin-info-value a:hover {
      text-decoration: underline;
    }
    
    .lp-admin-features {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .lp-admin-feature {
      padding: 12px 16px;
      background: rgba(0, 212, 170, 0.1);
      border-radius: 8px;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .lp-admin-feature::before {
      content: '✓';
      color: #00d4aa;
      font-weight: 600;
    }
    
    .lp-admin-notes-textarea {
      width: 100%;
      min-height: 120px;
      padding: 16px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: #ffffff;
      font-size: 14px;
      font-family: inherit;
      resize: vertical;
      outline: none;
      margin-bottom: 12px;
    }
    
    .lp-admin-notes-textarea:focus {
      border-color: rgba(0, 212, 170, 0.5);
    }
    
    .lp-admin-notes-textarea::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }
    
    .lp-admin-btn-save {
      background: linear-gradient(135deg, #00d4aa 0%, #00a8cc 100%);
      color: #ffffff;
    }
    
    .lp-admin-btn-save:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 20px rgba(0, 212, 170, 0.3);
    }
    
    .lp-admin-btn-save:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
    
    .lp-admin-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      font-size: 18px;
      color: rgba(255, 255, 255, 0.5);
    }
    
    .lp-admin-empty {
      padding: 48px;
      text-align: center;
      color: rgba(255, 255, 255, 0.4);
    }
    
    @media (max-width: 1024px) {
      .lp-admin-content {
        flex-direction: column;
        height: auto;
      }
      
      .lp-admin-list {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        max-height: 400px;
      }
      
      .lp-admin-detail {
        padding: 24px;
      }
      
      .lp-admin-info-grid {
        grid-template-columns: 1fr;
      }
      
      .lp-admin-info-item.full {
        grid-column: span 1;
      }
    }
    
    @media (max-width: 640px) {
      .lp-admin-header {
        flex-direction: column;
        gap: 16px;
        padding: 16px;
      }
      
      .lp-admin-stats {
        width: 100%;
        justify-content: space-around;
      }
      
      .lp-admin-detail-actions {
        flex-direction: column;
      }
      
      .lp-admin-status-select,
      .lp-admin-btn {
        width: 100%;
        justify-content: center;
      }
    }
  `

  if (loading) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        <div className="lp-admin">
          <div className="lp-admin-loading">読み込み中...</div>
        </div>
      </>
    )
  }

  const activeProjects = projects.filter(p => p.status !== '完了' && p.status !== 'キャンセル')
  const completedProjects = projects.filter(p => p.status === '完了')

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="lp-admin">
        <header className="lp-admin-header">
          <div className="lp-admin-header-left">
            <h1 className="lp-admin-title">
              LP制作管理
              <span className="lp-admin-title-badge">Admin</span>
            </h1>
            <a 
              href="/lp-order" 
              target="_blank" 
              rel="noopener noreferrer"
              className="lp-admin-form-link"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              申込フォームを開く
            </a>
          </div>
          <div className="lp-admin-stats">
            <div className="lp-admin-stat">
              <div className="lp-admin-stat-value">{activeProjects.length}</div>
              <div className="lp-admin-stat-label">進行中</div>
            </div>
            <div className="lp-admin-stat">
              <div className="lp-admin-stat-value">{completedProjects.length}</div>
              <div className="lp-admin-stat-label">完了</div>
            </div>
            <div className="lp-admin-stat">
              <div className="lp-admin-stat-value">{projects.length}</div>
              <div className="lp-admin-stat-label">全案件</div>
            </div>
          </div>
        </header>

        <div className="lp-admin-content">
          <div className="lp-admin-list">
            <div className="lp-admin-list-header">
              案件一覧（{projects.length}件）
            </div>
            {projects.length === 0 ? (
              <div className="lp-admin-empty">
                まだ案件がありません
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  className={`lp-admin-item ${selectedProject?.id === project.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedProject(project)
                    setEditingNotes(project.notes || '')
                  }}
                >
                  <div className="lp-admin-item-header">
                    <div className="lp-admin-item-company">
                      {project.client?.company_name}
                    </div>
                    <div
                      className="lp-admin-item-status"
                      style={{
                        background: `${statusColors[project.status]}20`,
                        color: statusColors[project.status],
                      }}
                    >
                      {project.status}
                    </div>
                  </div>
                  <div className="lp-admin-item-service">
                    {project.intake_form?.service_name || project.project_name}
                  </div>
                  <div className="lp-admin-item-meta">
                    <span>{formatDate(project.created_at)}</span>
                    <span className="lp-admin-item-days">
                      {getDaysElapsed(project.created_at)}日経過
                    </span>
                    <span className={`lp-admin-item-revision ${project.revision_count >= 3 ? 'warning' : ''}`}>
                      修正 {project.revision_count}/3
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="lp-admin-detail">
            {!selectedProject ? (
              <div className="lp-admin-detail-empty">
                案件を選択してください
              </div>
            ) : (
              <>
                <div className="lp-admin-detail-header">
                  <h2 className="lp-admin-detail-title">
                    {selectedProject.client?.company_name}
                  </h2>
                  <p className="lp-admin-detail-subtitle">
                    {selectedProject.intake_form?.service_name || selectedProject.project_name}
                  </p>
                </div>

                <div className="lp-admin-detail-actions">
                  <select
                    className="lp-admin-status-select"
                    value={selectedProject.status}
                    onChange={(e) => updateStatus(selectedProject.id, e.target.value)}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <button
                    className="lp-admin-btn lp-admin-btn-revision"
                    onClick={() => incrementRevision(selectedProject.id, selectedProject.revision_count)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    修正カウント（現在: {selectedProject.revision_count}回）
                  </button>
                </div>

                {/* 顧客情報 */}
                <div className="lp-admin-section">
                  <h3 className="lp-admin-section-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    顧客情報
                  </h3>
                  <div className="lp-admin-info-grid">
                    <div className="lp-admin-info-item">
                      <div className="lp-admin-info-label">担当者</div>
                      <div className="lp-admin-info-value">{selectedProject.client?.contact_name}</div>
                    </div>
                    <div className="lp-admin-info-item">
                      <div className="lp-admin-info-label">メール</div>
                      <div className="lp-admin-info-value">
                        <a href={`mailto:${selectedProject.client?.email}`}>{selectedProject.client?.email}</a>
                      </div>
                    </div>
                    <div className="lp-admin-info-item">
                      <div className="lp-admin-info-label">電話番号</div>
                      <div className="lp-admin-info-value">{selectedProject.client?.phone || '未登録'}</div>
                    </div>
                    <div className="lp-admin-info-item">
                      <div className="lp-admin-info-label">申込日</div>
                      <div className="lp-admin-info-value">
                        {formatDate(selectedProject.created_at)}（{getDaysElapsed(selectedProject.created_at)}日経過）
                      </div>
                    </div>
                  </div>
                </div>

                {/* サービス情報 */}
                {selectedProject.intake_form && (
                  <div className="lp-admin-section">
                    <h3 className="lp-admin-section-title">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      ヒアリング内容
                    </h3>
                    <div className="lp-admin-info-grid">
                      <div className="lp-admin-info-item">
                        <div className="lp-admin-info-label">業種</div>
                        <div className="lp-admin-info-value">{selectedProject.intake_form.industry}</div>
                      </div>
                      <div className="lp-admin-info-item">
                        <div className="lp-admin-info-label">LPの目的</div>
                        <div className="lp-admin-info-value">{selectedProject.intake_form.purpose}</div>
                      </div>
                      <div className="lp-admin-info-item full">
                        <div className="lp-admin-info-label">ターゲット</div>
                        <div className="lp-admin-info-value">{selectedProject.intake_form.target_audience}</div>
                      </div>
                      <div className="lp-admin-info-item full">
                        <div className="lp-admin-info-label">特徴・強み</div>
                        <div className="lp-admin-features">
                          {selectedProject.intake_form.features?.map((feature, index) => (
                            <div key={index} className="lp-admin-feature">{feature}</div>
                          ))}
                        </div>
                      </div>
                      {selectedProject.intake_form.achievements && (
                        <div className="lp-admin-info-item full">
                          <div className="lp-admin-info-label">実績・数字</div>
                          <div className="lp-admin-info-value">{selectedProject.intake_form.achievements}</div>
                        </div>
                      )}
                      {selectedProject.intake_form.pain_points && (
                        <div className="lp-admin-info-item full">
                          <div className="lp-admin-info-label">解決できる悩み</div>
                          <div className="lp-admin-info-value">{selectedProject.intake_form.pain_points}</div>
                        </div>
                      )}
                      <div className="lp-admin-info-item full">
                        <div className="lp-admin-info-label">CTA遷移先URL</div>
                        <div className="lp-admin-info-value">
                          <a href={selectedProject.intake_form.cta_url} target="_blank" rel="noopener noreferrer">
                            {selectedProject.intake_form.cta_url}
                          </a>
                        </div>
                      </div>
                      {selectedProject.intake_form.contact_info && (
                        <div className="lp-admin-info-item">
                          <div className="lp-admin-info-label">問い合わせ先</div>
                          <div className="lp-admin-info-value">{selectedProject.intake_form.contact_info}</div>
                        </div>
                      )}
                      {selectedProject.intake_form.design_mood && (
                        <div className="lp-admin-info-item">
                          <div className="lp-admin-info-label">デザインの雰囲気</div>
                          <div className="lp-admin-info-value">{selectedProject.intake_form.design_mood}</div>
                        </div>
                      )}
                      {selectedProject.intake_form.reference_url && (
                        <div className="lp-admin-info-item full">
                          <div className="lp-admin-info-label">参考サイト</div>
                          <div className="lp-admin-info-value">
                            <a href={selectedProject.intake_form.reference_url} target="_blank" rel="noopener noreferrer">
                              {selectedProject.intake_form.reference_url}
                            </a>
                          </div>
                        </div>
                      )}
                      {selectedProject.intake_form.notes && (
                        <div className="lp-admin-info-item full">
                          <div className="lp-admin-info-label">顧客からの備考</div>
                          <div className="lp-admin-info-value">{selectedProject.intake_form.notes}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* メモ */}
                <div className="lp-admin-section">
                  <h3 className="lp-admin-section-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    作業メモ
                  </h3>
                  <textarea
                    className="lp-admin-notes-textarea"
                    value={editingNotes}
                    onChange={(e) => setEditingNotes(e.target.value)}
                    placeholder="顧客対応のメモ、進捗状況など..."
                  />
                  <button
                    className="lp-admin-btn lp-admin-btn-save"
                    onClick={() => saveNotes(selectedProject.id)}
                    disabled={savingNotes}
                  >
                    {savingNotes ? '保存中...' : 'メモを保存'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}