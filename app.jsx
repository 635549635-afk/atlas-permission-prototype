const { useEffect, useRef, useState } = React;

const App = () => {
  const [screen, setScreen] = useState("request");
  const [planComplete, setPlanComplete] = useState(false);
  const timersRef = useRef([]);

  useEffect(() => () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const submitRequest = () => {
    setPlanComplete(false);
    setScreen("processing");

    const completeTimer = window.setTimeout(() => {
      setPlanComplete(true);
    }, 2000);

    const reviewTimer = window.setTimeout(() => {
      setScreen("task");
    }, 2800);

    timersRef.current = [completeTimer, reviewTimer];
  };

  if (screen === "processing") {
    return <ProcessingScreen planComplete={planComplete} />;
  }

  if (screen === "task") {
    return (
      <TaskDetailFlow
        onExit={() => setScreen("request")}
      />
    );
  }

  return <RequestScreen onSubmit={submitRequest} />;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
