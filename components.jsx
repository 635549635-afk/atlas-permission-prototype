const GlobalHeader = () => (
  <header className="global-header">
    <div className="global-header__inner">
      <div className="global-header__brand">权限管理</div>
      <div className="operator" aria-label="当前登录用户：王璐，经理">
        <div className="operator__avatar" aria-hidden="true">王璐</div>
        <div className="operator__meta">
          <span className="operator__name">王璐</span>
          <span className="operator__role">经理</span>
        </div>
      </div>
    </div>
  </header>
);

const ScreenShell = ({ children, label }) => (
  <div className="app-shell" data-screen-label={label}>
    <GlobalHeader />
    <main className="main-content">{children}</main>
  </div>
);

const RequestScreen = ({ onSubmit }) => {
  const [employeeSelectorOpen, setEmployeeSelectorOpen] = React.useState(false);

  return (
    <ScreenShell label="权限开通申请">
      <section className="screen" aria-labelledby="request-title">
        <h1 className="screen__title" id="request-title">权限开通申请</h1>
        <form className="panel request-form" onSubmit={(event) => event.preventDefault()}>
          <div className="form-grid">
            <div className="form-field form-field--full employee-field">
              <label className="field-label" id="employee-label">员工</label>
              <button
                className="employee-select"
                type="button"
                role="combobox"
                aria-labelledby="employee-label"
                aria-expanded={employeeSelectorOpen}
                aria-controls="employee-options"
                onClick={() => setEmployeeSelectorOpen((open) => !open)}
              >
                <span className="employee-select__value">
                  <span className="employee-select__avatar" aria-hidden="true">陈晨</span>
                  <span>陈晨</span>
                </span>
                <span className="employee-select__chevron" aria-hidden="true">⌄</span>
              </button>
              {employeeSelectorOpen && (
                <div className="employee-options" id="employee-options" role="listbox" aria-label="员工">
                  <button
                    className="employee-option is-selected"
                    type="button"
                    role="option"
                    aria-selected="true"
                    onClick={() => setEmployeeSelectorOpen(false)}
                  >
                    <span>陈晨</span>
                    <span aria-hidden="true">✓</span>
                  </button>
                </div>
              )}
            </div>

            <div className="form-field">
              <div className="field-label-row">
                <label className="field-label" htmlFor="job-title">岗位</label>
              </div>
              <input className="text-control text-control--readonly" id="job-title" value="软件产品设计师" readOnly tabIndex={-1} />
            </div>

            <div className="form-field">
              <div className="field-label-row">
                <label className="field-label" htmlFor="department">部门</label>
              </div>
              <input className="text-control text-control--readonly" id="department" value="上海产品研发部" readOnly tabIndex={-1} />
            </div>

            <div className="form-field">
              <div className="field-label-row">
                <label className="field-label" htmlFor="start-date">入职日期</label>
              </div>
              <input className="text-control text-control--readonly" id="start-date" value="9月7日" readOnly tabIndex={-1} />
            </div>

            <div className="form-field">
              <div className="field-label-row">
                <label className="field-label" htmlFor="manager">直属经理</label>
              </div>
              <input className="text-control text-control--readonly" id="manager" value="王璐" readOnly tabIndex={-1} />
            </div>

            <div className="form-field form-field--full">
              <div className="field-label-row">
                <label className="field-label" htmlFor="project">项目参与</label>
              </div>
              <input className="text-control text-control--readonly" id="project" value="Atlas 项目 · 至 12月31日" readOnly tabIndex={-1} />
            </div>

            <div className="form-field form-field--full">
              <label className="field-label" htmlFor="request-goal">申请目标</label>
              <textarea
                className="text-control textarea-control"
                id="request-goal"
                defaultValue="参考同岗位员工，为陈晨准备公司账号、日常工具和项目权限。"
                rows="3"
              ></textarea>
            </div>
          </div>

          <div className="panel-actions">
            <button className="primary-button" type="button" onClick={onSubmit}>提交需求</button>
          </div>
        </form>
      </section>
    </ScreenShell>
  );
};

const ProcessingStep = ({ label, processing }) => (
  <li className={`step${processing ? " is-processing" : ""}`}>
    <span className="step__marker" aria-hidden="true">
      {processing ? <span className="step__marker-dot"></span> : "✓"}
    </span>
    <span className="step__label">{label}</span>
    <span className="step__state">{processing ? "处理中" : "已完成"}</span>
  </li>
);

const ProcessingScreen = ({ planComplete }) => (
  <ScreenShell label="生成权限方案">
    <section className="screen" aria-labelledby="processing-title" aria-live="polite">
      <h1 className="screen__title" id="processing-title">生成权限方案</h1>
      <div className="panel">
        <div className="processing-heading">
          <span className={`processing-indicator${planComplete ? " is-complete" : ""}`} aria-hidden="true">
            {planComplete ? "✓" : ""}
          </span>
          <h2>Agent 正在生成权限方案</h2>
        </div>
        <p className="screen__description">正在核对员工信息、岗位标准与 Atlas 项目参与信息，请稍候……</p>
        <ol className="steps">
          <ProcessingStep label="核对员工信息" />
          <ProcessingStep label="匹配岗位标准权限" />
          <ProcessingStep label="核对 Atlas 项目参与信息" />
          <ProcessingStep label="生成权限方案" processing={!planComplete} />
        </ol>
      </div>
    </section>
  </ScreenShell>
);

Object.assign(window, {
  GlobalHeader,
  RequestScreen,
  ProcessingScreen,
});
