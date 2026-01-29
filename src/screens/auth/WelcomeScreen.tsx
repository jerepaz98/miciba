import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  FlatList,
  Animated,
  useWindowDimensions
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthStackParamList } from '../../navigation/AuthStack';
import { AppButton } from '../../components/ui/AppButton';
import { theme } from '../../constants/theme';
import { colors } from '../../constants/colors';
import { strings } from '../../constants/strings';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

type Slide = {
  id: string;
  image: any;
};

const ENABLE_AUTOPLAY = false;
const AUTOPLAY_INTERVAL = 5000;

const SLIDES: Slide[] = [
  { id: '1', image: require('../../../assets/onboarding/o1.png') },
  { id: '2', image: require('../../../assets/onboarding/o2.png') },
  { id: '3', image: require('../../../assets/onboarding/o3.png') },
  { id: '4', image: require('../../../assets/onboarding/o4.png') },
  { id: '5', image: require('../../../assets/onboarding/o5.png') }
];

export const WelcomeScreen = ({ navigation }: Props) => {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const listRef = useRef<FlatList<Slide>>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!ENABLE_AUTOPLAY) return;

    const id = setInterval(() => {
      const nextIndex = (activeIndex + 1) % SLIDES.length;
      listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setActiveIndex(nextIndex);
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(id);
  }, [activeIndex]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems?.length) {
      const index = viewableItems[0]?.index ?? 0;
      setActiveIndex(index);
    }
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  const renderItem = ({ item }: { item: Slide }) => (
    <View style={[styles.slide, { width, height }]}>
      <ImageBackground source={item.image} resizeMode="cover" style={styles.bgImage} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <View style={styles.container}>
        <Animated.FlatList
          ref={listRef}
          data={SLIDES}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false
          })}
          scrollEventThrottle={16}
        />

        {/* Overlay oscuro suave para legibilidad */}
        <View style={styles.overlay} />

        {/* Contenido fijo por encima del carrusel */}
        <View
          style={[
            styles.content,
            {
              paddingTop: insets.top + theme.spacing.xl,
              paddingBottom: insets.bottom + theme.spacing.lg
            }
          ]}
        >
          <View style={styles.centerBlock}>
            <View style={styles.dots}>
              {SLIDES.map((slide, index) => (
                <View
                  key={slide.id}
                  style={[styles.dot, index === activeIndex ? styles.dotActive : null]}
                />
              ))}
            </View>

            <Text style={styles.title}>{strings.auth.welcomeTitle}</Text>
            <Text style={styles.subtitle}>{strings.auth.welcomeSubtitle}</Text>
          </View>

          <View style={styles.actions}>
            <AppButton
              title={strings.auth.signIn}
              onPress={() => navigation.navigate('SignIn')}
              style={styles.primaryBtn}
              textStyle={styles.primaryText}
            />
            <AppButton
              title={strings.auth.createAccount}
              onPress={() => navigation.navigate('SignUp')}
              style={styles.secondaryBtn}
              textStyle={styles.secondaryText}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg
  },
  container: {
    flex: 1
  },
  slide: {
    flex: 1
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)'
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg
  },
  centerBlock: {
    alignItems: 'center',
    gap: 10
  },
  title: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 32,
    color: colors.white,
    textAlign: 'center'
  },
  subtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center'
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: theme.spacing.md
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.4)'
  },
  dotActive: {
    width: 22,
    backgroundColor: colors.white
  },
  actions: {
    width: '100%',
    gap: theme.spacing.md
  },
  primaryBtn: {
    backgroundColor: '#74E0D0',
    borderRadius: 14,
    paddingVertical: 14
  },
  primaryText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: '#0B3A4A'
  },
  secondaryBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    borderRadius: 14,
    paddingVertical: 14
  },
  secondaryText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: colors.white
  }
});

