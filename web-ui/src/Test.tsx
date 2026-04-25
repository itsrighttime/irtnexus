import { AddressInput } from "./atoms";
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
import { TestLayout } from "./tests/layout/TestLayout";
import { TestTabs } from "./tests/layout/TestTabs";

export function Test() {
  return (
    <>
      {/* <TestTabs /> */}
      {/* <TestLayout /> */}
      {/* <TestTable /> */}
      <TestGenericForm />
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
