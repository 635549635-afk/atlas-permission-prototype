const StatusTag = ({ type, children }) => (
  <span className={`status-tag status-tag--${type}`}>{children}</span>
);

const PageHeader = ({
  onBack,
  showBack = true,
  backLabel = "返回",
  title = "开通方案审阅",
  titleId = "review-title",
  status = "待经理确认",
  statusType = "pending",
  subtitle = "Agent 已完成信息核对并生成权限方案",
}) => (
  <header className="review-page-header">
    <div className="review-page-header__title-row">
      {showBack && (
        <button className="back-button" type="button" onClick={onBack}>
          <span aria-hidden="true">←</span>
          <span>{backLabel}</span>
        </button>
      )}
      <h1 id={titleId}>{title}</h1>
      <StatusTag type={statusType}>{status}</StatusTag>
    </div>
    <p>{subtitle}</p>
  </header>
);

const EmployeeSummary = () => (
  <section className="review-section employee-summary" aria-label="陈晨员工摘要">
    <div className="employee-summary__content">
      <div className="employee-summary__avatar" aria-hidden="true">陈晨</div>
      <div className="employee-summary__details">
        <strong>陈晨</strong>
        <span className="employee-summary__role">软件产品设计师 · 上海产品研发部</span>
        <span className="employee-summary__meta">9月7日入职 · 直属经理 王璐 · Atlas 项目至 12月31日</span>
      </div>
    </div>
  </section>
);

const ExpandableEvidence = ({ id, open, onToggle, onClose, buttonText, title, children }) => {
  const controlRef = React.useRef(null);
  const buttonRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) return undefined;

    const closePopover = () => onClose?.();
    const handlePointerDown = (event) => {
      if (controlRef.current && !controlRef.current.contains(event.target)) closePopover();
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closePopover();
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <div className="evidence-control" ref={controlRef}>
      <button
        className="text-action"
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={onToggle}
        ref={buttonRef}
      >
        <span>{buttonText}</span>
        <span className={`text-action__chevron${open ? " is-open" : ""}`} aria-hidden="true">›</span>
      </button>
      {open && (
        <div className="evidence-panel" id={id} role="region" aria-label={title}>
          <h3>{title}</h3>
          {children}
        </div>
      )}
    </div>
  );
};

const AgentPlanSummary = ({ evidenceOpen, onToggleEvidence, onCloseEvidence }) => (
  <div className="plan-summary">
    <div className="review-section__heading-row">
      <div>
        <h2 className="review-section__title" id="permissions-title">建议开通 · 7</h2>
        <p>基于岗位标准与 Atlas 项目参与信息生成</p>
      </div>
      <ExpandableEvidence
        id="plan-evidence"
        open={evidenceOpen}
        onToggle={onToggleEvidence}
        onClose={onCloseEvidence}
        buttonText="查看方案依据"
        title="方案依据"
      >
        <ol className="evidence-list">
          <li>
            <strong>岗位标准</strong>
            <p>根据「软件产品设计师」岗位标准匹配基础工作权限。</p>
          </li>
          <li>
            <strong>Atlas 项目参与信息</strong>
            <p>陈晨参与 Atlas 项目至 12 月 31 日，因此补充与项目工作直接相关的权限。</p>
          </li>
          <li>
            <strong>历史特殊权限处理</strong>
            <p>同岗位员工的历史特殊权限仅作为参考，不直接照搬。</p>
          </li>
        </ol>
      </ExpandableEvidence>
    </div>
  </div>
);

const verificationSummaryIcons = {
  success: "✓",
  missing: "!",
  conflict: "!",
};

const VerificationSummary = ({
  variant = "success",
  title = "信息核对完成",
  description = "已核对人事信息、岗位匹配与项目参与信息，未发现缺失信息或规则冲突",
}) => (
  <div className={`verification-inline verification-inline--${variant}`} role="status">
    <span className="verification-inline__icon" aria-hidden="true">{verificationSummaryIcons[variant] || verificationSummaryIcons.success}</span>
    <div>
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  </div>
);

const PermissionCard = ({ name, statuses, identity, metaItems, muted, approval }) => (
  <article className={`permission-card${muted ? " permission-card--muted" : ""}${approval ? " permission-card--approval" : ""}${metaItems.some((item) => item.emphasis) ? " permission-card--layered-meta" : ""}`}>
    <div className="permission-card__header">
      <div className="permission-card__title-group">
        <h4>{name}</h4>
      </div>
      <div className="permission-card__statuses">{statuses}</div>
    </div>
    {identity && (
      <div className="permission-card__body">
        <p>{identity}</p>
      </div>
    )}
    {metaItems.length > 0 && (
      <div className="permission-card__meta">
        {metaItems.map((item, index) => (
          <div className={`permission-card__meta-row${item.emphasis ? " permission-card__meta-row--emphasis" : ""}`} key={`${item.text}-${index}`}>
            {item.icon && <span className="permission-card__meta-icon" aria-hidden="true">ⓘ</span>}
            {item.label && <span className="permission-card__meta-label">{item.label}：</span>}
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    )}
  </article>
);

const PermissionItem = ({
  variant = "card",
  name,
  identity,
  condition,
  approval,
  statusLabel = "建议开通",
  statusType = "recommended",
  singleStatus = false,
  metaItems,
  detail,
  requestId,
  actionLabel,
  onAction,
}) => {
  const resolvedMetaItems = metaItems !== undefined
    ? metaItems
    : approval
      ? [{ icon: true, text: "数据负责人审批 · 不可导出 · 12月31日自动失效" }]
      : [{ icon: true, text: condition }];

  if (variant === "list") {
    return (
      <article className={`permission-list-item permission-list-item--${statusType}`}>
        <div className="permission-list-item__main">
          <div className="permission-list-item__heading">
            <div className="permission-list-item__heading-main">
              <h3>{name}</h3>
              <StatusTag type={statusType}>{statusLabel}</StatusTag>
            </div>
            {requestId && <span className="permission-list-item__request">{requestId}</span>}
          </div>
          {(detail || actionLabel) && (
            <div className="permission-list-item__detail-row">
              {detail && <p className="permission-list-item__detail">{detail}</p>}
              {actionLabel && (
                <button className="text-action permission-list-item__action" type="button" onClick={onAction}>
                  <span>{actionLabel}</span><span aria-hidden="true">›</span>
                </button>
              )}
            </div>
          )}
        </div>
      </article>
    );
  }

  return (
    <PermissionCard
      name={name}
      identity={identity}
      approval={approval}
      statuses={(
        <>
          <StatusTag type={statusType}>{statusLabel}</StatusTag>
          {approval && !singleStatus && <StatusTag type="approval">需审批</StatusTag>}
        </>
      )}
      metaItems={resolvedMetaItems}
    />
  );
};

const PermissionGroup = ({ number, title, children }) => {
  const singleItem = React.Children.count(children) === 1;

  return (
    <section className="permission-group" aria-labelledby={`permission-group-${number}`}>
      <div className="permission-group__heading">
        <h3 id={`permission-group-${number}`}>{title}</h3>
      </div>
      <div className={`permission-grid${singleItem ? " permission-grid--single" : ""}`}>{children}</div>
    </section>
  );
};

const ExcludedPermissionItem = ({ name, reason, statusLabel = "未纳入方案", statusType = "excluded" }) => (
  <PermissionCard
    name={name}
    muted
    statuses={<StatusTag type={statusType}>{statusLabel}</StatusTag>}
    metaItems={[{ label: "原因", text: reason }]}
  />
);

const BottomActionBar = ({ onAdjust, onConfirm, summary, primaryLabel = "确认开通", transitionKey = "default" }) => (
  <div className={`bottom-action-bar${summary ? " bottom-action-bar--summary" : ""}`}>
    <div className="bottom-action-bar__inner">
      <div className="bottom-action-bar__content stage-fade" key={transitionKey}>
        {summary ? (
          <div className="bottom-action-bar__submission">
            <p className="bottom-action-bar__summary">{summary}</p>
            <button className="primary-button" type="button" onClick={onConfirm}>{primaryLabel}</button>
          </div>
        ) : (
          <>
            <button className="secondary-button" type="button" onClick={onAdjust}>调整方案</button>
            <button className="primary-button" type="button" onClick={onConfirm}>{primaryLabel}</button>
          </>
        )}
      </div>
    </div>
  </div>
);

const P01StageContent = ({
  planEvidenceOpen,
  excludedEvidenceOpen,
  onTogglePlanEvidence,
  onToggleExcludedEvidence,
  onClosePlanEvidence,
  onCloseExcludedEvidence,
}) => (
  <div className="review-stage-content">
    <VerificationSummary />

    <section className="review-section permissions-section" aria-labelledby="permissions-title">
      <AgentPlanSummary
        evidenceOpen={planEvidenceOpen}
        onToggleEvidence={onTogglePlanEvidence}
        onCloseEvidence={onClosePlanEvidence}
      />

      <PermissionGroup number="01" title="基础账号">
        <PermissionItem
          name="公司账号"
          identity="标准员工账号"
          condition="经理确认后创建"
        />
      </PermissionGroup>

      <PermissionGroup number="02" title="Atlas 项目工作权限">
        <PermissionItem
          name="Atlas 项目看板"
          identity="项目成员 · 可编辑任务"
          condition="不可管理项目"
        />
        <PermissionItem
          name="Atlas 项目文件库"
          identity="项目成员 · 目录读写"
          condition="不含客户原始资料目录"
        />
        <PermissionItem
          name="设计工具"
          identity="Atlas 团队编辑者"
          condition="需要可用许可证"
        />
      </PermissionGroup>

      <PermissionGroup number="03" title="通用及数据权限">
        <PermissionItem
          name="产品数据看板"
          identity="项目成员 · 只读"
          condition="需审批 · 不可导出 · 12月31日自动失效"
          approval
        />
        <PermissionItem
          name="邮件与即时通信"
          identity="普通成员"
          condition="依赖公司账号"
        />
        <PermissionItem
          name="知识库"
          identity="普通成员 · 只读"
          condition="依赖公司账号"
        />
      </PermissionGroup>
    </section>

    <section className="review-section excluded-section" aria-labelledby="excluded-title">
      <div className="review-section__heading-row excluded-section__heading">
        <h2 className="review-section__title" id="excluded-title">被排除权限 · 2</h2>
        <ExpandableEvidence
          id="excluded-evidence"
          open={excludedEvidenceOpen}
          onToggle={onToggleExcludedEvidence}
          onClose={onCloseExcludedEvidence}
          buttonText="查看排除依据"
          title="排除依据"
        >
          <p className="evidence-copy">同岗位员工拥有的「客户数据导出」和「生产系统管理」权限属于历史工作需要，不属于当前岗位标准权限，因此不能直接照搬。</p>
        </ExpandableEvidence>
      </div>
      <div className="excluded-grid">
        <ExcludedPermissionItem
          name="客户数据导出"
          reason="历史工作需要，不属于软件产品设计师标准权限。"
        />
        <ExcludedPermissionItem
          name="生产系统管理"
          reason="历史工作需要，不属于当前岗位标准权限。"
        />
      </div>
    </section>
  </div>
);

const P01ReviewScreen = ({ onBack, onConfirm }) => {
  const [planEvidenceOpen, setPlanEvidenceOpen] = React.useState(false);
  const [excludedEvidenceOpen, setExcludedEvidenceOpen] = React.useState(false);
  const [adjustNoticeVisible, setAdjustNoticeVisible] = React.useState(false);
  const noticeTimerRef = React.useRef(null);

  React.useEffect(() => () => {
    if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
  }, []);

  const showAdjustNotice = () => {
    setAdjustNoticeVisible(true);
    if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = window.setTimeout(() => setAdjustNoticeVisible(false), 2600);
  };

  return (
    <div className="app-shell review-shell" data-screen-label="P01 开通方案审阅">
      <GlobalHeader />
      <main className="review-main" aria-labelledby="review-title">
        <PageHeader onBack={onBack} />
        <div className="review-module-stack">
          <EmployeeSummary />
          <P01StageContent
            planEvidenceOpen={planEvidenceOpen}
            excludedEvidenceOpen={excludedEvidenceOpen}
            onTogglePlanEvidence={() => {
              setExcludedEvidenceOpen(false);
              setPlanEvidenceOpen((open) => !open);
            }}
            onToggleExcludedEvidence={() => {
              setPlanEvidenceOpen(false);
              setExcludedEvidenceOpen((open) => !open);
            }}
            onClosePlanEvidence={() => setPlanEvidenceOpen(false)}
            onCloseExcludedEvidence={() => setExcludedEvidenceOpen(false)}
          />
        </div>

      </main>

      {adjustNoticeVisible && (
        <div className="prototype-notice" role="status">调整方案流程不在本次原型范围内</div>
      )}
      <BottomActionBar onAdjust={showAdjustNotice} onConfirm={onConfirm} />
    </div>
  );
};

const P02Placeholder = () => (
  <ScreenShell label="P02 权限与执行确认">
    <section className="screen" aria-labelledby="p02-title">
      <h1 className="screen__title" id="p02-title">权限与执行确认</h1>
      <div className="panel placeholder-panel">
        <span>P02</span>
      </div>
    </section>
  </ScreenShell>
);

Object.assign(window, {
  StatusTag,
  PageHeader,
  EmployeeSummary,
  AgentPlanSummary,
  VerificationSummary,
  PermissionGroup,
  PermissionCard,
  PermissionItem,
  ExpandableEvidence,
  ExcludedPermissionItem,
  BottomActionBar,
  P01StageContent,
  P01ReviewScreen,
  P02Placeholder,
});
