//: ----------------------------------------------------------------------------
//:
//: ----------------------------------------------------------------------------
export function stripHTMLComments(input: string): string {
  return input.replace(/(?=<!--)([\s\S]*?)-->/g, "")
    //: (+) veriKami - remove multiple leading spaces
    .replace(/^\s+/gm, "");
}
