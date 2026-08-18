const ExecutionProgressSummary = ({ onViewResults, onItemAction }) => (
  <section className="review-section execution-progress-summary" aria-labelledby="execution-progress-title">
    <div className="execution-progress-summary__top">
      <h2 className="review-section__title" id="execution-progress-title">执行概览：7 项权限执行中</h2>
      <button className="text-action" type="button" onClick={onViewResults}>
        <span>查看执行结果</span><span aria-hidden="true">›</span>
      </button>
    </div>
    <div className="execution-progress-summary__stats" aria-label="执行状态统计">
      <StatusTag type="success">4 项成功</StatusTag>
      <StatusTag type="executing">1 项执行中</StatusTag>
      <StatusTag type="awaiting">1 项待审批</StatusTag>
      <StatusTag type="blocked">1 项被阻塞</StatusTag>
    </div>
    <P03PermissionList onItemAction={onItemAction} />
  </section>
);

const P03PermissionList = ({ onItemAction }) => (
  <div className="permission-list">
    <PermissionItem variant="list" name="公司账号" statusLabel="成功" statusType="success" detail="已完成标准员工账号创建" requestId="REQ-20260817-001" />
    <PermissionItem variant="list" name="邮件与即时通信" statusLabel="成功" statusType="success" detail="已完成普通成员权限开通" requestId="REQ-20260817-002" />
    <PermissionItem variant="list" name="知识库" statusLabel="成功" statusType="success" detail="已完成全员内容只读权限开通" requestId="REQ-20260817-003" />
    <PermissionItem variant="list" name="Atlas 项目看板" statusLabel="成功" statusType="success" detail="已完成项目成员可编辑权限开通" requestId="REQ-20260817-004" />
    <PermissionItem variant="list" name="Atlas 项目文件库" statusLabel="执行中" statusType="executing" detail="查询开通结果超时，当前无法判断是否已经开通" actionLabel="查询结果" onAction={() => onItemAction("正在查询 Atlas 项目文件库开通结果")} />
    <PermissionItem variant="list" name="设计工具" statusLabel="被阻塞" statusType="blocked" detail="需要处理：没有可用许可证" actionLabel="配置可用许可证" onAction={() => onItemAction("许可证配置流程不在本次原型范围内")} />
    <PermissionItem variant="list" name="产品数据看板" statusLabel="待审批" statusType="awaiting" detail="已提交审批申请，等待数据负责人审批" actionLabel="查看审批状态" onAction={() => onItemAction("正在等待数据负责人审批")} />
  </div>
);

const P03StageContent = ({ onViewResults, onItemAction }) => (
  <div className="review-stage-content">
    <ExecutionProgressSummary onViewResults={onViewResults} onItemAction={onItemAction} />
  </div>
);

const SuccessResultItem = ({ name, requestId, onViewDetails }) => (
  <article className="success-result-item">
    <div className="success-result-item__name">
      <StatusTag type="success">成功</StatusTag>
      <h4>{name}</h4>
      <span className="success-result-item__request">{requestId}</span>
    </div>
    <button className="text-action success-result-item__action" type="button" onClick={onViewDetails}>
      <span>查看详情</span><span aria-hidden="true">›</span>
    </button>
  </article>
);

const ResultItem = ({ name, status, statusType, requestId, reason, description, details, actionLabel, onAction }) => (
  <article className={`result-item result-item--${statusType}`}>
    <div className="result-item__content">
      <div className="result-item__header">
        <StatusTag type={statusType}>{status}</StatusTag>
        <h4>{name}</h4>
        <span className="success-result-item__request">{requestId}</span>
      </div>
      <div className="result-item__meta-row">
        <p className="result-item__summary">
          <span className="result-item__reason">{reason}</span>
          {description && <span className="result-item__detail"> · {description}</span>}
          {details && <span className="result-item__detail"> · {details}</span>}
        </p>
        <button className="text-action result-item__action" type="button" onClick={onAction}>
          <span>{actionLabel}</span><span aria-hidden="true">›</span>
        </button>
      </div>
    </div>
  </article>
);

const F01PlaceholderModal = ({ onClose }) => {
  const [notice, setNotice] = React.useState("");
  const noticeTimerRef = React.useRef(null);
  const backdropRef = React.useRef(null);
  const modalRef = React.useRef(null);
  const closeButtonRef = React.useRef(null);

  React.useEffect(() => {
    const backdrop = backdropRef.current;
    const backgroundElements = Array.from(backdrop?.parentElement?.children || [])
      .filter((element) => element !== backdrop)
      .map((element) => ({ element, wasInert: element.hasAttribute("inert") }));

    backgroundElements.forEach(({ element }) => element.setAttribute("inert", ""));

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = Array.from(modalRef.current?.querySelectorAll(
        'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ) || []).filter((element) => element.getClientRects().length > 0);

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && (activeElement === firstElement || !modalRef.current?.contains(activeElement))) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && (activeElement === lastElement || !modalRef.current?.contains(activeElement))) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      backgroundElements.forEach(({ element, wasInert }) => {
        if (!wasInert) element.removeAttribute("inert");
      });
      if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
    };
  }, [onClose]);

  const showNotice = (message) => {
    setNotice(message);
    if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = window.setTimeout(() => setNotice(""), 2400);
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()} ref={backdropRef}>
      <section className="large-modal result-modal" role="dialog" aria-modal="true" aria-labelledby="f01-modal-title" ref={modalRef}>
        <div className="large-modal__header result-modal__header">
          <div>
            <h2 id="f01-modal-title">执行结果</h2>
            <p>本次权限开通已完成部分处理，请查看各项结果</p>
          </div>
          <button className="modal-close" type="button" aria-label="关闭执行结果" onClick={onClose} ref={closeButtonRef}>×</button>
        </div>

        <div className="large-modal__body result-modal__body">
          <section className="result-summary" aria-labelledby="result-summary-title">
            <h3 className="review-section__title" id="result-summary-title">本次结果：7 项权限</h3>
            <div className="execution-progress-summary__stats result-summary__statuses" aria-label="执行结果统计">
              <StatusTag type="success">4 项成功</StatusTag>
              <StatusTag type="failed">1 项失败</StatusTag>
              <StatusTag type="awaiting">1 项待审批</StatusTag>
              <StatusTag type="unknown">1 项结果未知</StatusTag>
            </div>
          </section>

          <section className="result-section" aria-labelledby="success-results-title">
            <h3 id="success-results-title">成功 · 4</h3>
            <div className="success-result-list">
              <SuccessResultItem name="公司账号" requestId="REQ-20260817-001" onViewDetails={() => showNotice("正在查看公司账号执行详情")} />
              <SuccessResultItem name="邮件与即时通信" requestId="REQ-20260817-002" onViewDetails={() => showNotice("正在查看邮件与即时通信执行详情")} />
              <SuccessResultItem name="知识库" requestId="REQ-20260817-003" onViewDetails={() => showNotice("正在查看知识库执行详情")} />
              <SuccessResultItem name="Atlas 项目看板" requestId="REQ-20260817-004" onViewDetails={() => showNotice("正在查看 Atlas 项目看板执行详情")} />
            </div>
          </section>

          <section className="result-section result-section--attention" aria-label="需要关注的执行结果">
            <h3>失败 · 1</h3>
            <ResultItem
              name="设计工具"
              status="失败"
              statusType="failed"
              requestId="REQ-20260817-005"
              reason="无可用许可证"
              actionLabel="配置可用许可证"
              onAction={() => showNotice("许可证配置流程不在本次原型范围内")}
            />

            <h3>待审批 · 1</h3>
            <ResultItem
              name="产品数据看板"
              status="待审批"
              statusType="awaiting"
              requestId="REQ-20260817-006"
              reason="等待数据负责人审批"
              actionLabel="查看审批状态"
              onAction={() => showNotice("正在等待数据负责人审批")}
            />

            <h3>结果未知 · 1</h3>
            <ResultItem
              name="Atlas 项目文件库"
              status="结果未知"
              statusType="unknown"
              requestId="REQ-20260817-007"
              reason="请求超时"
              actionLabel="查询结果"
              onAction={() => showNotice("正在查询 Atlas 项目文件库开通结果")}
            />
          </section>
        </div>

        {notice && <div className="result-modal__notice" role="status">{notice}</div>}
      </section>
    </div>
  );
};

Object.assign(window, {
  ExecutionProgressSummary,
  P03PermissionList,
  P03StageContent,
  SuccessResultItem,
  ResultItem,
  F01PlaceholderModal,
});
