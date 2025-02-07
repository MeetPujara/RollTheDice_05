import React, {useState, useRef} from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
  Easing,
} from 'react-native';
import DiceOne from '../assets/One.png';
import DiceTwo from '../assets/Two.png';
import DiceThree from '../assets/Three.png';
import DiceFour from '../assets/Four.png';
import DiceFive from '../assets/Five.png';
import DiceSix from '../assets/Six.png';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const diceFaces: ImageSourcePropType[] = [
  DiceOne,
  DiceTwo,
  DiceThree,
  DiceFour,
  DiceFive,
  DiceSix,
];

const Dice = ({
  imageUrl,
  spinValue,
}: {
  imageUrl: ImageSourcePropType;
  spinValue: Animated.Value;
}) => {
  const rotateInterpolate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={{transform: [{rotate: rotateInterpolate}]}}>
      <Image style={styles.diceImage} source={imageUrl} />
    </Animated.View>
  );
};

export default function App(): JSX.Element {
  const [diceImage, setDiceImage] = useState<ImageSourcePropType>(DiceOne);
  const spinValue = useRef(new Animated.Value(0)).current;

  const rollDiceOnTap = () => {
    ReactNativeHapticFeedback.trigger('impactHeavy', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });

    // Reset spin
    spinValue.setValue(0);

    // Start continuous rotation
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 0,
        duration: 200, // Faster spin initially
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      {iterations: 4}, // Spins 4 times before stopping
    );

    spinAnimation.start();

    let rollingInterval = setInterval(() => {
      setDiceImage(diceFaces[Math.floor(Math.random() * 6)]);
    }, 100);

    setTimeout(() => {
      clearInterval(rollingInterval);
      spinAnimation.stop();
      setDiceImage(diceFaces[Math.floor(Math.random() * 6)]);
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎲 Roll the Dice!</Text>
      <Dice imageUrl={diceImage} spinValue={spinValue} />
      <Pressable onPress={rollDiceOnTap} style={styles.rollDiceBtn}>
        <Text style={styles.rollDiceBtnText}>Roll Now</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E1E2C',
  },
  title: {
    fontSize: 28,
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  diceImage: {
    width: 150,
    height: 150,
  },
  rollDiceBtn: {
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.3,
    shadowOffset: {width: 2, height: 4},
  },
  rollDiceBtnText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
