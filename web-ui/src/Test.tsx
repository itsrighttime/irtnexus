import {
  TestCalendar,
  TestDropdown,
  TestGenericForm,
  TestIconGallery,
  TestJsonField,
  TestSearchBox,
  TestTextArea,
  TestTextInput,
} from "./tests";

export function Test() {
  return (
    <>
      <TestJsonField />
      <TestTextArea />
      <TestDropdown />
      <TestCalendar />
      <TestTextInput />
      {/* <TestGenericForm /> */}
    </>
  );
}
