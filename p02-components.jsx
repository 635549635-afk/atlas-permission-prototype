const ExecutionSummary = () => (
  <section className="review-section execution-summary" aria-labelledby="execution-summary-title">
    <div className="execution-summary__overview">
      <strong id="execution-summary-title">本次方案：7 项权限</strong>
      <span>6 项可执行 · 1 项需审批</span>
    </div>
    <p className="execution-summary__rule">
      公司账号创建成功后，可直接执行项将在提交后进入执行；需审批项将先提交至对应审批人，审批通过后再执行。
    </p>
  </section>
);

const P02PermissionSection = ({ id, title, single = false, muted = false, children }) => (
  <section className={`review-section p02-permission-section${muted ? " p02-permission-section--muted" : ""}`} aria-labelledby={id}>
    <h2 className="review-section__title" id={id}>{title}</h2>
    <div className={`permission-grid${single ? " permission-grid--single" : ""}`}>{children}</div>
  </section>
);

const P02StageContent = () => (
  <div className="review-stage-content">
    <ExecutionSummary />

    <P02PermissionSection id="executable-title" title="可执行 · 6">
      <PermissionItem
        name="公司账号"
        identity="标准员工账号"
        statusLabel="可执行"
        statusType="executable"
        metaItems={[{ icon: true, text: "经理已确认创建" }]}
      />
      <PermissionItem
        name="Atlas 项目看板"
        identity="项目成员 · 可编辑任务"
        statusLabel="可执行"
        statusType="executable"
        metaItems={[{ icon: true, text: "不可管理项目" }]}
      />
      <PermissionItem
        name="Atlas 项目文件库"
        identity="项目成员 · 目录读写"
        statusLabel="可执行"
        statusType="executable"
        metaItems={[{ icon: true, text: "不含客户原始资料目录" }]}
      />
      <PermissionItem
        name="设计工具"
        identity="Atlas 团队编辑者"
        statusLabel="可执行"
        statusType="executable"
        metaItems={[{ icon: true, text: "需要可用许可证" }]}
      />
      <PermissionItem
        name="邮件与即时通信"
        identity="普通成员"
        statusLabel="可执行"
        statusType="executable"
        metaItems={[{ icon: true, text: "依赖：公司账号创建成功" }]}
      />
      <PermissionItem
        name="知识库"
        identity="普通成员 · 只读"
        statusLabel="可执行"
        statusType="executable"
        metaItems={[{ icon: true, text: "依赖：公司账号创建成功" }]}
      />
    </P02PermissionSection>

    <P02PermissionSection id="approval-title" title="需审批 · 1" single>
      <PermissionItem
        name="产品数据看板"
        identity="项目成员"
        approval
        singleStatus
        statusLabel="需审批"
        statusType="approval"
        metaItems={[
          { emphasis: true, text: "数据负责人审批" },
          { text: "只读 · 不可导出 ｜ 有效期至 12月31日" },
        ]}
      />
    </P02PermissionSection>

    <P02PermissionSection id="denied-title" title="不应开通 · 2" muted>
      <ExcludedPermissionItem
        name="客户数据导出"
        statusLabel="不予开通"
        statusType="denied"
        reason="历史工作需要，不属于软件产品设计师标准权限。"
      />
      <ExcludedPermissionItem
        name="生产系统管理"
        statusLabel="不予开通"
        statusType="denied"
        reason="历史工作需要，不属于当前岗位标准权限。"
      />
    </P02PermissionSection>
  </div>
);

const P02ExecutionScreen = ({ onBack, onSubmit }) => (
  <div className="app-shell review-shell" data-screen-label="P02 权限与执行确认">
    <GlobalHeader />
    <main className="review-main" aria-labelledby="p02-title">
      <PageHeader
        onBack={onBack}
        title="权限与执行确认"
        titleId="p02-title"
        status="待提交执行"
        statusType="pending"
        subtitle="请根据方案，继续确认各项权限的执行条件"
      />

      <div className="review-module-stack">
        <EmployeeSummary />
        <P02StageContent />
      </div>
    </main>

    <BottomActionBar
      summary="提交后，6 项直接执行，1 项进入审批"
      primaryLabel="确认并提交"
      onConfirm={onSubmit}
    />
  </div>
);

const TaskDetailFlow = ({ onExit }) => {
  const [stage, setStage] = React.useState("p01");
  const [planEvidenceOpen, setPlanEvidenceOpen] = React.useState(false);
  const [excludedEvidenceOpen, setExcludedEvidenceOpen] = React.useState(false);
  const [adjustNoticeVisible, setAdjustNoticeVisible] = React.useState(false);
  const [p03Notice, setP03Notice] = React.useState("");
  const [resultModalOpen, setResultModalOpen] = React.useState(false);
  const noticeTimerRef = React.useRef(null);
  const resultModalTriggerRef = React.useRef(null);
  const isP02 = stage === "p02";
  const isP03 = stage === "p03";

  React.useEffect(() => () => {
    if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
  }, []);

  const showAdjustNotice = () => {
    setAdjustNoticeVisible(true);
    if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = window.setTimeout(() => setAdjustNoticeVisible(false), 2600);
  };

  const showP03Notice = (message) => {
    setP03Notice(message);
    if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = window.setTimeout(() => setP03Notice(""), 2600);
  };

  const openResultModal = React.useCallback((event) => {
    resultModalTriggerRef.current = event.currentTarget;
    setResultModalOpen(true);
  }, []);

  const closeResultModal = React.useCallback(() => {
    setResultModalOpen(false);
    window.requestAnimationFrame(() => resultModalTriggerRef.current?.focus());
  }, []);

  const stageConfig = isP03
    ? { title: "跨系统执行进度", titleId: "p03-title", status: "执行中", statusType: "executing", subtitle: "系统正在按执行顺序完成权限开通" }
    : isP02
      ? { title: "权限与执行确认", titleId: "p02-title", status: "待提交执行", statusType: "pending", subtitle: "请根据方案，继续确认各项权限的执行条件" }
      : { title: "开通方案审阅", titleId: "review-title", status: "待经理确认", statusType: "pending", subtitle: "Agent 已完成信息核对并生成权限方案" };

  return (
    <div className={`app-shell review-shell${isP03 ? " review-shell--no-actions" : ""}`} data-screen-label={isP03 ? "P03 跨系统执行进度" : isP02 ? "P02 权限与执行确认" : "P01 开通方案审阅"}>
      <GlobalHeader />
      <main className="review-main" aria-labelledby={stageConfig.titleId}>
        <div className="task-stage-header stage-fade" key={`header-${stage}`}>
          <PageHeader
            showBack
            backLabel={isP03 ? "返回权限申请" : "返回"}
            onBack={isP03 ? () => {} : isP02 ? () => setStage("p01") : onExit}
            {...stageConfig}
          />
        </div>

        <div className="review-module-stack">
          <EmployeeSummary />
          <div className="task-stage-content stage-fade" key={`content-${stage}`}>
            {isP03 ? (
              <P03StageContent onViewResults={openResultModal} onItemAction={showP03Notice} />
            ) : isP02 ? (
              <P02StageContent />
            ) : (
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
            )}
          </div>
        </div>
      </main>

      {adjustNoticeVisible && !isP02 && !isP03 && (
        <div className="prototype-notice" role="status">调整方案流程不在本次原型范围内</div>
      )}

      {p03Notice && isP03 && <div className="prototype-notice" role="status">{p03Notice}</div>}

      {!isP03 && (
        <BottomActionBar
          transitionKey={stage}
          onAdjust={isP02 ? undefined : showAdjustNotice}
          onConfirm={isP02 ? () => setStage("p03") : () => setStage("p02")}
          summary={isP02 ? "提交后，6 项直接执行，1 项进入审批" : undefined}
          primaryLabel={isP02 ? "确认并提交" : "确认开通"}
        />
      )}

      {resultModalOpen && <F01PlaceholderModal onClose={closeResultModal} />}
    </div>
  );
};

const P03Placeholder = () => (
  <ScreenShell label="P03 跨系统执行进度">
    <section className="screen" aria-labelledby="p03-title">
      <h1 className="screen__title" id="p03-title">跨系统执行进度</h1>
      <div className="panel placeholder-panel">
        <span>P03</span>
      </div>
    </section>
  </ScreenShell>
);

Object.assign(window, {
  ExecutionSummary,
  P02PermissionSection,
  P02StageContent,
  P02ExecutionScreen,
  TaskDetailFlow,
  P03Placeholder,
});
