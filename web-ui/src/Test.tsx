import {
  TestAudioUpload,
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
      <TestAudioUpload />
      <TestJsonField />
      <TestTextArea />
      <TestDropdown />
      <TestCalendar />
      <TestTextInput />
      {/* <TestGenericForm /> */}
    </>
  );
}
