import {
  TestCalendar,
  TestDropdown,
  TestGenericForm,
  TestIconGallery,
  TestSearchBox,
  TestTextArea,
  TestTextInput,
} from "./tests";

export function Test() {
  return (
    <>
      <TestTextArea />
      <TestDropdown />
      <TestCalendar />
      <TestTextInput />
      {/* <TestGenericForm /> */}
    </>
  );
}
