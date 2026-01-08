# fetchResources 함수 생성 작업

`src\client-services\rag.api.ts`에 fetchResource 함수 만들어주세요.

**요구 사항**:

1. 반환 타입: `S>`

**References**:
```json
 "/api/rags/resources": {
      "get": {
        "parameters": [
          {
            "schema": {
              "type": "string"
            },
            "required": false,
            "name": "cursor",
            "in": "query"
          },
          {
            "schema": {
              "type": "number",
              "nullable": true
            },
            "required": false,
            "name": "limit",
            "in": "query"
          },
          {
            "schema": {
              "type": "string",
              "enum": [
                "asc",
                "desc"
              ]
            },
            "required": false,
            "name": "direction",
            "in": "query"
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
                    },
                    "data": {
                      "type": "object",
                      "properties": {
                        "items": {
                          "type": "array",
                          "items": {
                            "type": "object",
                            "properties": {
                              "id": {
                                "type": "string"
                              },
                              "userId": {
                                "type": "string"
                              },
                              "name": {
                                "type": "string",
                                "example": "embedding.txt"
                              },
                              "fileType": {
                                "type": "string",
                                "enum": [
                                  "text",
                                  "txt",
                                  "pdf"
                                ]
                              },
                              "createdAt": {
                                "type": "string",
                                "nullable": true,
                                "format": "date"
                              }
                            },
                            "required": [
                              "id",
                              "userId",
                              "name",
                              "fileType",
                              "createdAt"
                            ]
                          }
                        },
                        "nextCursor": {
                          "anyOf": [
                            {
                              "type": "string"
                            },
                            {
                              "nullable": true
                            },
                            {
                              "nullable": true
                            }
                          ]
                        },
                        "totalElements": {
                          "type": "number",
                          "example": 100
                        },
                        "hasNext": {
                          "type": "boolean",
                          "example": true
                        }
                      },
                      "required": [
                        "items",
                        "nextCursor",
                        "totalElements",
                        "hasNext"
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
    },
```