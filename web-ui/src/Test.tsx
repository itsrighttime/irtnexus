import {
  TestAudioUpload,
  TestCalendar,
  TestDropdown,
  TestFileUpload,
  TestGenericForm,
  TestIconGallery,
  TestImageUpload,
  TestJsonField,
  TestMarkdown,
  TestSearchBox,
  TestTextArea,
  TestTextInput,
  TestVideoUpload,
} from "./tests";

export function Test() {
  return (
    <>
      <TestMarkdown />
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
