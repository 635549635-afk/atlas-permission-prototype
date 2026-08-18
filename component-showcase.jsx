const ComponentStateShowcase = () => {
  const [openEvidence, setOpenEvidence] = React.useState(null);
  const [notice, setNotice] = React.useState("");
  const noticeTimerRef = React.useRef(null);

  React.useEffect(() => () => {
    if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
  }, []);

  const showNotice = (message) => {
    setNotice(message);
    if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = window.setTimeout(() => setNotice(""), 2400);
  };

  return (
    <main className="component-showcase" data-screen-label="核心组件状态展示">
      <header className="component-showcase__header">
        <h1>核心组件状态展示</h1>
        <p>用于内部设计检查与 PDF 截图，组件尺寸、字号和状态语义与正式原型保持一致。</p>
      </header>

      <div className="component-showcase__sections">
        <section className="showcase-section" aria-labelledby="showcase-permission-title">
          <div className="showcase-section__header">
            <h2 id="showcase-permission-title">权限项</h2>
            <p>卡片与列表两种展示形态</p>
          </div>

          <div className="showcase-subsection">
            <h3>卡片</h3>
            <div className="permission-grid">
              <PermissionItem
                name="Atlas 项目看板"
                identity="项目成员 · 可编辑任务"
                statusLabel="建议开通"
                statusType="recommended"
                metaItems={[{ icon: true, text: "不可管理项目" }]}
              />
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
            </div>
          </div>

          <div className="showcase-subsection">
            <h3>列表</h3>
            <div className="permission-list">
              <PermissionItem
                variant="list"
                name="公司账号"
                statusLabel="成功"
                statusType="success"
                detail="已完成标准员工账号创建"
                requestId="REQ-20260817-001"
              />
              <PermissionItem
                variant="list"
                name="设计工具"
                statusLabel="被阻塞"
                statusType="blocked"
                detail="需要处理：没有可用许可证"
                actionLabel="配置可用许可证"
                onAction={() => showNotice("许可证配置流程不在本次原型范围内")}
              />
            </div>
          </div>
        </section>

        <section className="showcase-section" aria-labelledby="showcase-status-title">
          <div className="showcase-section__header">
            <h2 id="showcase-status-title">状态标签</h2>
            <p>当前项目主要业务状态</p>
          </div>
          <div className="showcase-status-tags">
            <StatusTag type="recommended">建议开通</StatusTag>
            <StatusTag type="approval">需审批</StatusTag>
            <StatusTag type="executable">可执行</StatusTag>
            <StatusTag type="success">成功</StatusTag>
            <StatusTag type="executing">执行中</StatusTag>
            <StatusTag type="awaiting">待审批</StatusTag>
            <StatusTag type="blocked">被阻塞</StatusTag>
            <StatusTag type="failed">失败</StatusTag>
            <StatusTag type="unknown">结果未知</StatusTag>
            <StatusTag type="excluded">未纳入方案</StatusTag>
            <StatusTag type="denied">不予开通</StatusTag>
          </div>
        </section>

        <section className="showcase-section" aria-labelledby="showcase-button-title">
          <div className="showcase-section__header">
            <h2 id="showcase-button-title">按钮 / 操作组件</h2>
            <p>主要操作的默认、悬停、聚焦与禁用状态</p>
          </div>
          <div className="showcase-button-states">
            <div className="showcase-button-state">
              <span className="showcase-state-name">默认</span>
              <button className="primary-button" type="button" onClick={() => showNotice("按钮操作正常")}>确认并提交</button>
            </div>
            <div className="showcase-button-state">
              <span className="showcase-state-name">悬停</span>
              <button className="primary-button showcase-button--hover" type="button" onClick={() => showNotice("按钮操作正常")}>确认并提交</button>
            </div>
            <div className="showcase-button-state">
              <span className="showcase-state-name">聚焦</span>
              <button className="primary-button showcase-button--focus" type="button" onClick={() => showNotice("按钮操作正常")}>确认并提交</button>
            </div>
            <div className="showcase-button-state">
              <span className="showcase-state-name">禁用</span>
              <button className="primary-button" type="button" disabled aria-disabled="true">确认并提交</button>
            </div>
          </div>
        </section>

        <section className="showcase-section" aria-labelledby="showcase-verification-title">
          <div className="showcase-section__header">
            <h2 id="showcase-verification-title">信息核对摘要</h2>
            <p>正常、信息缺失与规则冲突</p>
          </div>
          <div className="showcase-verification-list">
            <div className="showcase-verification-item">
              <span className="showcase-state-name">正常</span>
              <VerificationSummary />
            </div>
            <div className="showcase-verification-item">
              <span className="showcase-state-name">信息缺失</span>
              <VerificationSummary
                variant="missing"
                title="信息不完整"
                description="缺少直属经理信息，请补充后继续生成方案"
              />
            </div>
            <div className="showcase-verification-item">
              <span className="showcase-state-name">规则冲突</span>
              <VerificationSummary
                variant="conflict"
                title="发现规则冲突"
                description="岗位标准与项目权限规则存在冲突，需要经理确认处理方式"
              />
            </div>
          </div>
        </section>

        <section className="showcase-section showcase-section--evidence" aria-labelledby="showcase-evidence-title">
          <div className="showcase-section__header">
            <h2 id="showcase-evidence-title">方案依据</h2>
            <p>点击入口查看 Popover 展开与收起状态</p>
          </div>
          <div className="showcase-evidence-row">
            <div className="showcase-evidence-sample">
              <span>建议开通 · 7</span>
              <ExpandableEvidence
                id="showcase-plan-evidence"
                open={openEvidence === "plan"}
                onToggle={() => setOpenEvidence((current) => current === "plan" ? null : "plan")}
                onClose={() => setOpenEvidence(null)}
                buttonText="查看方案依据"
                title="方案依据"
              >
                <ol className="evidence-list">
                  <li><strong>岗位标准</strong><p>根据「软件产品设计师」岗位标准匹配基础工作权限。</p></li>
                  <li><strong>Atlas 项目参与信息</strong><p>陈晨参与 Atlas 项目至 12 月 31 日，因此补充与项目工作直接相关的权限。</p></li>
                  <li><strong>历史特殊权限处理</strong><p>同岗位员工的历史特殊权限仅作为参考，不直接照搬。</p></li>
                </ol>
              </ExpandableEvidence>
            </div>
            <div className="showcase-evidence-sample">
              <span>被排除权限 · 2</span>
              <ExpandableEvidence
                id="showcase-excluded-evidence"
                open={openEvidence === "excluded"}
                onToggle={() => setOpenEvidence((current) => current === "excluded" ? null : "excluded")}
                onClose={() => setOpenEvidence(null)}
                buttonText="查看排除依据"
                title="排除依据"
              >
                <p className="evidence-copy">同岗位员工拥有的「客户数据导出」和「生产系统管理」权限属于历史工作需要，不属于当前岗位标准权限，因此不能直接照搬。</p>
              </ExpandableEvidence>
            </div>
          </div>
        </section>

        <section className="showcase-section" aria-labelledby="showcase-result-title">
          <div className="showcase-section__header">
            <h2 id="showcase-result-title">执行结果项</h2>
            <p>成功、失败、待审批与结果未知</p>
          </div>

          <div className="showcase-result-group">
            <h3>成功</h3>
            <div className="success-result-list">
              <SuccessResultItem
                name="公司账号"
                requestId="REQ-20260817-001"
                onViewDetails={() => showNotice("正在查看公司账号执行详情")}
              />
            </div>
          </div>

          <div className="showcase-result-group">
            <h3>需要关注</h3>
            <div className="showcase-result-stack">
              <ResultItem
                name="设计工具"
                status="失败"
                statusType="failed"
                requestId="REQ-20260817-005"
                reason="无可用许可证"
                actionLabel="配置可用许可证"
                onAction={() => showNotice("许可证配置流程不在本次原型范围内")}
              />
              <ResultItem
                name="产品数据看板"
                status="待审批"
                statusType="awaiting"
                requestId="REQ-20260817-006"
                reason="等待数据负责人审批"
                actionLabel="查看审批状态"
                onAction={() => showNotice("正在等待数据负责人审批")}
              />
              <ResultItem
                name="Atlas 项目文件库"
                status="结果未知"
                statusType="unknown"
                requestId="REQ-20260817-007"
                reason="请求超时"
                actionLabel="查询结果"
                onAction={() => showNotice("正在查询 Atlas 项目文件库开通结果")}
              />
            </div>
          </div>
        </section>
      </div>

      {notice && <div className="prototype-notice" role="status">{notice}</div>}
    </main>
  );
};

const showcaseRoot = ReactDOM.createRoot(document.getElementById("root"));
showcaseRoot.render(<ComponentStateShowcase />);
