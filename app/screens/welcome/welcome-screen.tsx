import React, { FC } from "react"
import { View, ViewStyle, TextStyle, SafeAreaView, StyleSheet } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import {
  Button,
  Screen,
  Text,
  GradientBackground,
} from "../../components"
import { color, spacing, typography } from "../../theme"
import { NavigatorParamList } from "../../navigators"
import CharacterInput from '../../components/character-input/CharacterInput'
import NumericInput from "react-native-numeric-input"
import { useStores } from "../../models"
import { Chip } from 'react-native-paper'

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
}
const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: typography.primary,
}
const BOLD: TextStyle = { fontWeight: "bold" }
const TITLE_WRAPPER: TextStyle = {
  ...TEXT,
  textAlign: "center",
}
const TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 28,
  lineHeight: 38,
  textAlign: "center",
}
const CONTINUE: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  backgroundColor: color.palette.deepPurple,
}
const CONTINUE_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
}
const FOOTER: ViewStyle = { backgroundColor: "#20162D" }
const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
}

const styles = StyleSheet.create({
  numericInput: {
    alignSelf: 'center',
    paddingTop: 20
  },
  firstInput: {
    flex: 1,
    padding: 10
  },
  secondInput: {
    flex: 1,
    padding: 10
  },
  wordList: {
    flex: 1,
    alignItems: 'center'
  },
  singleChip: {
    margin: 4,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12
  },
})

export const WelcomeScreen: FC<StackScreenProps<NavigatorParamList, "welcome">> = observer(
  ({ navigation }) => {
    const nextScreen = () => navigation.navigate("demo")
    
    const { wordStore } = useStores()

    const [numberOfCharacters, setNumberOfCharacters] = React.useState(7)
    const [word, setWord] = React.useState('')
    const [foundWords, setFoundWords] = React.useState([])

    const onChangeNumberOfCharacters = (value) => {
      setNumberOfCharacters(value)
    }

    const onChangeWord = (value) => {
      setWord(value)
    }

    const updateFoundWords = async () => {
      const result = await wordStore.getWords(word.toLowerCase().substring(0, numberOfCharacters))

      setFoundWords(result)
    }
    const renderFoundWordList = () => {
      return foundWords.sort((a, b) => (b.value > a.value) ? 1 : -1).map((word, index) => {
        return (<Chip style={styles.singleChip} children={word.word + " " + word.value} mode="outlined" key={word + index}/>);
      })
    }

    return (
      <View testID="WelcomeScreen" style={FULL}>
        <GradientBackground colors={["#422443", "#281b34"]} />
        <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
          <View style={styles.firstInput}>
            <Text style={TITLE_WRAPPER}>
              <Text style={TITLE} text="Number of Letters" />
            </Text>
            <View style={styles.numericInput}>
              <NumericInput 
                value={numberOfCharacters}
                minValue={2}
                maxValue={7}
                onLimitReached={(isMax,msg) => console.log(isMax,msg)}
                onChange={value => onChangeNumberOfCharacters(value)}
                totalWidth={150}
                textColor='#ffffff'
                rightButtonBackgroundColor='#808080' 
                leftButtonBackgroundColor='#808080'  />
            </View>
          </View>
          <View style={styles.secondInput}>
            <Text style={TITLE_WRAPPER}>
              <Text style={TITLE} text="Your Letters" />
            </Text>
            <CharacterInput
              autoFocus={true}
              placeHolder={" ".repeat(numberOfCharacters)}
              showCharBinary={"1".repeat(numberOfCharacters)}
              handleChange={(value) => {onChangeWord(value)}}
              keyboardType='default'
              doShake={false}
            />
          </View>
          {foundWords.length > 0 ? 
          <View style={styles.wordList}>
            <View style = {styles.wordList}>
              <View style={styles.row}>
                {renderFoundWordList()}
              </View>
            </View>
          </View> : 
          <View style={styles.wordList}> 
            <Text style={TITLE_WRAPPER}>
              <Text style={TITLE} text="No Words can be created from your letters" />
            </Text>
          </View>}
        </Screen>
        <SafeAreaView style={FOOTER}>
          <View style={FOOTER_CONTENT}>
            <Button
              testID="next-screen-button"
              style={CONTINUE}
              textStyle={CONTINUE_TEXT}
              tx="welcomeScreen.continue"
              onPress={async() => {updateFoundWords()}}
            />
          </View>
        </SafeAreaView>
      </View>
    )
  },
)
