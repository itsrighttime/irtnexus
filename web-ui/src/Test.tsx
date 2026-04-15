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
import { UseLayoutExample } from "./tests/layout/TestLayout";

export function Test() {
  return (
    <>
      <UseLayoutExample />
      {/* <TestTable /> */}
      {/* <TestGenericForm /> */}
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
      {/* <TestIconGallery /> */}
    </>
  );
}
