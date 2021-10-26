import { ApiResponse } from "apisauce"
import { Api } from "./api"
import { GetWordsResult } from "./api.types"
import { getGeneralApiProblem } from "./api-problem"

export class WordsApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async getWords(letters): Promise<GetWordsResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(
        "http://wordfindjava-env-1.eba-vteiqxva.us-east-1.elasticbeanstalk.com/findWords",
        {letters: letters}
      )

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const words = response.data

      return words 
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}
