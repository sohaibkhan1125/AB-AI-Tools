
'use server';
/**
 * @fileOverview Genkit flow for converting CSV text to XML format using AI.
 * - convertCsvToXml - Function that takes CSV text and returns XML text.
 * - CsvToXmlInput - Input type for the convertCsvToXml function.
 * - CsvToXmlOutput - Output type for the convertCsvToXml function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CsvToXmlInputSchema = z.object({
  csvText: z.string().min(1, { message: "CSV text cannot be empty."})
    .describe('The CSV content as a string.'),
});
export type CsvToXmlInput = z.infer<typeof CsvToXmlInputSchema>;

const CsvToXmlOutputSchema = z.object({
  xmlText: z.string().describe('The converted XML content as a string, or an error message.'),
  success: z.boolean().describe('Indicates if the conversion was successful.'),
  message: z.string().optional().describe('Optional message, e.g., for errors.'),
});
export type CsvToXmlOutput = z.infer<typeof CsvToXmlOutputSchema>;

const csvToXmlGenPrompt = ai.definePrompt({
  name: 'csvToXmlGenPrompt',
  input: { schema: CsvToXmlInputSchema },
  output: { schema: z.object({ xmlString: z.string() }) }, // AI should output just the XML string
  prompt: `You are an expert data format converter. Your task is to convert the given CSV (Comma Separated Values) string into a well-formed XML string.

Guidelines for CSV to XML conversion:
1.  The first line of the CSV should be treated as header names. These headers will become the XML tag names for the data in subsequent rows.
2.  Each row in the CSV (after the header row) should represent a distinct record or item in the XML.
3.  Create a root XML element, for example, named <Records> or <Dataset>.
4.  Inside the root element, each CSV row should be wrapped in an element, for example, <Record> or <Item>.
5.  Within each <Record> (or <Item>) element, each value from the CSV row should be wrapped in an XML tag corresponding to its header.
    - Example: If a header is "ProductName", and a value is "Laptop", the XML should be <ProductName>Laptop</ProductName>.
6.  Ensure all XML tag names are valid. If CSV headers contain spaces or special characters not allowed in XML tags, replace them with an underscore or remove them. For example, "Product Name" could become "Product_Name". Ensure tags start with a letter or underscore.
7.  Your entire output must be ONLY the XML string. Do NOT include any other text, explanations, or markdown formatting like \`\`\`xml ... \`\`\`.

CSV Input:
{{{csvText}}}

Example:
If CSV is:
Name,Age,City
Alice,30,New York
Bob,24,San Francisco

A good XML output would be:
<Records>
  <Record>
    <Name>Alice</Name>
    <Age>30</Age>
    <City>New York</City>
  </Record>
  <Record>
    <Name>Bob</Name>
    <Age>24</Age>
    <City>San Francisco</City>
  </Record>
</Records>
`,
  config: {
    temperature: 0.1, // Lower temperature for deterministic data transformation
  },
});

const csvToXmlFlow = ai.defineFlow(
  {
    name: 'csvToXmlFlow',
    inputSchema: CsvToXmlInputSchema,
    outputSchema: CsvToXmlOutputSchema,
  },
  async (input) => {
    if (!input.csvText.trim()) {
        return {
            xmlText: 'Input CSV text is empty.',
            success: false,
            message: 'Input CSV text is empty.',
        };
    }
    try {
      const { output } = await csvToXmlGenPrompt({ csvText: input.csvText });
      if (!output || !output.xmlString) {
        return {
          xmlText: 'AI model did not return valid XML output.',
          success: false,
          message: 'AI model did not return valid XML output.',
        };
      }
      // Basic check: does it look like XML?
      if (!output.xmlString.trim().startsWith('<') || !output.xmlString.trim().endsWith('>')) {
         return {
          xmlText: 'AI did not return well-formed XML. It might have returned an explanation instead.',
          success: false,
          message: `AI output does not appear to be XML: ${output.xmlString.substring(0,100)}...`,
        };
      }
      return { xmlText: output.xmlString.trim(), success: true };
    } catch (e: any) {
      console.error("CSV to XML conversion error in AI flow:", e);
      return {
        xmlText: `AI Conversion failed: ${e.message || 'Unknown error during AI processing.'}`,
        success: false,
        message: `AI Conversion failed: ${e.message || 'Unknown error during AI processing.'}`,
      };
    }
  }
);

export async function convertCsvToXml(input: CsvToXmlInput): Promise<CsvToXmlOutput> {
  return csvToXmlFlow(input);
}
