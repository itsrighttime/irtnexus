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
  TestTable,
  TestTextArea,
  TestTextInput,
  TestVideoUpload,
} from "./tests";

export function Test() {
  return (
    <>
      <TestTable />
      {/* <TestMarkdown />
      <TestFileUpload />
      <TestImageUpload />
      <TestVideoUpload />
      <TestAudioUpload />
      <TestJsonField />
      <TestTextArea />
      <TestDropdown />
      <TestCalendar />
      <TestTextInput /> */}
      <TestIconGallery />
    </>
  );
}
