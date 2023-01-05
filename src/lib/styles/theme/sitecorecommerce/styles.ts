import {last} from "lodash"

export const styles = {
  // styles for the `body`
  global: {
    body: {
      bg: "bodyBg",
      color: "text",

      fontSize: "sm",

      _dark: {
        color: "textColor.100"
      },
      h1: {
        fontWeight: "300 !important",
        color: "gray.300 !important",
        fontSize: "40px !important",
        width: "100%",
        textAlign: "left",
        pl: "25px"
      },
      //MOVE THESE TO PROPER PLACE AFTER V1 RELEASE
      ".facet-input": {
        input: {
          bg: "inputBg",
          border: "1px",
          borderColor: "gray.200",
          mb: "20px",
          width: "100%",
          height: "40px",
          pl: "20px"
        }
      },
      "input[type=text]": {
        bg: "inputBg",
        border: "1px",
        borderColor: "gray.200",
        mb: "20px"
      },
      input: {
        bg: "inputBg",
        border: "1px",
        borderColor: "gray.200",
        mb: "20px",
        borderRadius: "md"
      },
      "input:read-only": {
        bg: "none",
        border: "0px",
        PointerEvent: "none",
        pl: "0px"
      },
      ".chakra-input": {
        bg: "inputBg",
        border: "1px",
        borderColor: "gray.200",
        mb: "20px"
      },
      ".css-1jj9yua": {height: "38px"},
      ".breadcrumb": {
        ol: {
          "list-style": "none",
          li: {
            "list-style": "none",
            position: "relative",
            display: "inline-flex",
            height: "100%",
            "text-transform": "uppercase",
            color: "gray.300",
            "letter-spacing": "1px",
            "font-size": "16px",
            margin: "5px",
            cursor: "pointer",
            fontWeight: "normal",
            _after: {
              content: '" | "',
              pl: "20px",
              pr: "20px"
            },
            _last: {
              color: "#252525",
              "justify-content": "center",
              "align-items": "center",
              //"box-shadow": "0 2px 5px rgba(0,0,0,0.26)",
              border: "1px",
              borderColor: "gray.300",
              padding: "0 40px",
              borderRadius: "md",
              _after: {
                content: '""',
                pl: "0px",
                pr: "0px"
              }
            },
            _hover: {
              color: "#252525",
              borderColor: "#252525"
            }
          }
        }
      }
    }
  }
}
