import {
  TestCalendar,
  TestDropdown,
  TestGenericForm,
  TestIconGallery,
  TestSearchBox,
  TestTextInput,
} from "./tests";

export function Test() {
  return (
    <>
      <TestDropdown />
      <TestCalendar />
      <TestTextInput />
      {/* <TestGenericForm /> */}
    </>
  );
}
