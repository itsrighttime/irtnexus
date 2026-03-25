import {
  TestAudioUpload,
  TestCalendar,
  TestDropdown,
  TestFileUpload,
  TestGenericForm,
  TestIconGallery,
  TestImageUpload,
  TestJsonField,
  TestSearchBox,
  TestTextArea,
  TestTextInput,
  TestVideoUpload,
} from "./tests";

export function Test() {
  return (
    <>
      <TestFileUpload />
      <TestImageUpload />
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
