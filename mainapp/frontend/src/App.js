import Header from "components/Header";
import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "./App.css";
import { Container } from "react-bootstrap";
const TodoList = React.lazy(() => import("TodoModule/Todo"));
const SampleComponent = React.lazy(() =>
  import("AnotherModule/SampleComponent")
);
const EventSampleComponent = React.lazy(() =>
  import("EventModule/EventSampleComponent")
);
// const EventList = React.lazy(() => import("EventModule/Event"));
function App() {
  return (
    <>
      <div className="App">
        <Header />
        <Container>
          <Suspense fallback="Loading...">
            <TodoList />
          </Suspense>
        </Container>
      </div>
      <SampleComponent />
      <EventSampleComponent />
      <Router>
        <Link to="http://localhost:3003/">Event Section</Link>
      </Router>
    </>
  );
}
export default App;
