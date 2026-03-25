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
  TestVideoUpload,
} from "./tests";

export function Test() {
  return (
    <>
      <TestVideoUpload />
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
