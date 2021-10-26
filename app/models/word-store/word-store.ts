import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { WordsApi } from "../../services/api/word-api"
import { withEnvironment } from "../extensions/with-environment"

// Get words that can be made from the given letters.
export const WordStoreModel = types
  .model("WordStore")
  .extend(withEnvironment)
  .actions((self) => ({
    getWords: async (letters) => {
      const wordsApi = new WordsApi(self.environment.api)
      const words = await wordsApi.getWords(letters)

      return words
    },
  }))

type WordStoreType = Instance<typeof WordStoreModel>
export interface WordStore extends WordStoreType {}
type WordStoreSnapshotType = SnapshotOut<typeof WordStoreModel>
export interface WordStoreSnapshot extends WordStoreSnapshotType {}
export const createWordStoreDefaultModel = () => types.optional(WordStoreModel, {})