import React, { FC } from "react"
import { View, ViewStyle, TextStyle, SafeAreaView, StyleSheet } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import {
  Button,
  Screen,
  Text,
  Header,
  GradientBackground,
  Icon,
} from "../../components"
import { color, spacing, typography } from "../../theme"
import { NavigatorParamList } from "../../navigators"
import CharacterInput from '../../components/character-input/CharacterInput'
import NumericInput from "react-native-numeric-input"
import { useStores } from "../../models"
import { Chip } from 'react-native-paper'
import Constants from 'expo-constants'
import {
  AdMobBanner,
} from 'expo-ads-admob'

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
const HEADER: TextStyle = {
  paddingTop: spacing[4],
  paddingBottom: spacing[4] + spacing[1],
  paddingHorizontal: 0,
}
const HEADER_TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 8,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
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
  headerLogo: {
    alignSelf: 'center',
    height: 75,
    width: 150
  },
})

const testID = 'ca-app-pub-3940256099942544/6300978111';
const productionID = 'ca-app-pub-8812453476407098/8342626582';
// Is a real device and running in production.
const adUnitID = Constants.isDevice && !__DEV__ ? productionID : testID;

export const WelcomeScreen: FC<StackScreenProps<NavigatorParamList, "welcome">> = observer(
  ({ navigation }) => {
    const nextScreen = () => navigation.navigate("demo")
    
    const { wordStore } = useStores()

    const [numberOfCharacters, setNumberOfCharacters] = React.useState(7)
    const [word, setWord] = React.useState('')
    const [foundWords, setFoundWords] = React.useState([])

    const AdView = () => {
    
      return (
        <View>
          <AdMobBanner
            bannerSize="banner"
            adUnitID={adUnitID} // Test ID, Replace with your-admob-unit-id
            servePersonalizedAds={true}
            />
        </View>
      );
    };

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
        return (<Chip style={styles.singleChip} children={word.word + " " + word.value} mode="outlined" key={word + index}/>
        );
      })
    }

    return (
      <View testID="WelcomeScreen" style={FULL}>
        <GradientBackground colors={["#422443", "#281b34"]} />
        <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
          <View>
            <Icon style={styles.headerLogo} icon="logo" ></Icon>
            <Header headerTx="welcomeScreen.poweredBy" style={HEADER} titleStyle={HEADER_TITLE} />
          </View>
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
                <AdView/>
                {renderFoundWordList()}
                <AdView/>
              </View>
            </View>
          </View> : 
          <View style={styles.wordList}> 
            <Text style={TITLE_WRAPPER}>
              <Text style={TITLE} text="No words can be created from your letters" />
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
