# Client에서 서버로 요청을 보내는 함수들 생성 작업

아래의 Open API 명세서를 참고해서 서버로 요청을 보내는 함수들 생성해주세요. 요청을 보낼 때 쿠키를 포함하도록 설정해주세요.


```json
{
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "My-Agent API"
  },
  "components": {
    "schemas": {

    },
    "parameters": {

    }
  },
    "/api/conversations/:conversationId": {
      "delete": {
        "parameters": [
          {
            "schema": {
              "type": "string",
              "format": "uuid"
            },
            "required": true,
            "name": "conversationId",
            "in": "path"
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {
                      "type": "boolean",
                      "example": true
                    },
                    "message": {
                      "type": "string",
                      "example": "요청이 성공적으로 처리되었습니다."
                    },
                    "data": {
                      "type": "object",
                      "properties": {
                        "conversationId": {
                          "type": "string"
                        }
                      },
                      "required": [
                        "conversationId"
                      ]
                    }
                  },
                  "required": [
                    "success",
                    "message",
                    "data"
                  ]
                }
              }
            }
          },
          "400": {
            "description": "유효하지 않은 요청 형식",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {
                      "type": "boolean",
                      "example": false
                    },
                    "code": {
                      "type": "string"
                    },
                    "message": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "success",
                    "code",
                    "message"
                  ]
                },
                "example": {
                  "success": false,
                  "code": "INVALID_REQUEST_FORMAT",
                  "message": "유효하지 않은 요청 형식입니다."
                }
              }
            }
          },
          "404": {
            "description": "Not Found Conversation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {
                      "type": "boolean",
                      "example": false
                    },
                    "code": {
                      "type": "string"
                    },
                    "message": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "success",
                    "code",
                    "message"
                  ]
                },
                "example": {
                  "success": false,
                  "code": "CONVERSATION_NOT_FOUND",
                  "message": "해당 대화가 존재하지 않습니다."
                }
              }
            }
          }
        }
      }
    },
    "/api/conversations/:conversationId/favorites": {
      "post": {
        "parameters": [
          {
            "schema": {
              "type": "string",
              "format": "uuid"
            },
            "required": true,
            "name": "conversationId",
            "in": "path"
          }
        ],
        "responses": {
          "200": {
            "description": "요청 성공 응답",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {
                      "type": "boolean",
                      "example": true
                    },
                    "message": {
                      "type": "string",
                      "example": "요청이 성공적으로 처리되었습니다."
                    }
                  },
                  "required": [
                    "success",
                    "message"
                  ]
                }
              }
            }
          },
          "400": {
            "description": "유효하지 않은 요청 형식",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {
                      "type": "boolean",
                      "example": false
                    },
                    "code": {
                      "type": "string"
                    },
                    "message": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "success",
                    "code",
                    "message"
                  ]
                },
                "example": {
                  "success": false,
                  "code": "INVALID_REQUEST_FORMAT",
                  "message": "유효하지 않은 요청 형식입니다."
                }
              }
            }
          },
          "404": {
            "description": "Not Found Conversation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {
                      "type": "boolean",
                      "example": false
                    },
                    "code": {
                      "type": "string"
                    },
                    "message": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "success",
                    "code",
                    "message"
                  ]
                },
                "example": {
                  "success": false,
                  "code": "CONVERSATION_NOT_FOUND",
                  "message": "해당 대화가 존재하지 않습니다."
                }
              }
            }
          }
        }
      },
      "delete": {
        "parameters": [
          {
            "schema": {
              "type": "string",
              "format": "uuid"
            },
            "required": true,
            "name": "conversationId",
            "in": "path"
          }
        ],
        "responses": {
          "200": {
            "description": "요청 성공",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {
                      "type": "boolean",
                      "example": true
                    },
                    "message": {
                      "type": "string",
                      "example": "요청이 성공적으로 처리되었습니다."
                    }
                  },
                  "required": [
                    "success",
                    "message"
                  ]
                }
              }
            }
          },
          "400": {
            "description": "유효하지 않은 요청 형식",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {
                      "type": "boolean",
                      "example": false
                    },
                    "code": {
                      "type": "string"
                    },
                    "message": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "success",
                    "code",
                    "message"
                  ]
                },
                "example": {
                  "success": false,
                  "code": "INVALID_REQUEST_FORMAT",
                  "message": "유효하지 않은 요청 형식입니다."
                }
              }
            }
          },
          "500": {
            "description": "서버 내부 오류",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {
                      "type": "boolean",
                      "example": false
                    },
                    "code": {
                      "type": "string"
                    },
                    "message": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "success",
                    "code",
                    "message"
                  ]
                },
                "example": {
                  "success": false,
                  "code": "INTERNAL_SERVER_ERROR",
                  "message": "서버 내부에 오류가 발생했습니다."
                }
              }
            }
          }
        }
      }
    }
  }
}
```