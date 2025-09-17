type Props = {};
declare module "TodoModule/Todo" {
  const Todo: React.ComponentType<Props>;
  export default Todo;
}
declare module "AnotherModule/SampleComponent" {
  const SampleComponent: React.ComponentType<Props>;
  export default SampleComponent;
}
declare module "EventModule/EventSampleComponent" {
  const EventSampleComponent: React.ComponentType<Props>;
  export default EventSampleComponent;
}