import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLang } from '../navigation/LangContext';
import { TESTS } from '../data/tests';

const C = { primary:'#1B2A4A', accent:'#4A90D9', gold:'#F5C518', bg:'#F0F4FF', card:'#fff', text:'#1a1a2e', light:'#8892b0' };
const LEVEL_INFO = {
  beginner: { color:'#27ae60', bg:'#e8f8f0', label:'🟢 Başlangyç', icon:'🌱' },
  intermediate: { color:'#e67e22', bg:'#fef0e0', label:'🟡 Orta', icon:'⚡' },
  advanced: { color:'#e74c3c', bg:'#fde8e8', label:'🔴 Ösen', icon:'🎯' },
};

export default function TestsScreen({ navigation }) {
  const { t } = useLang();
  const [selectedLevel, setSelectedLevel] = useState('all');

  const byLevel = (lv) => TESTS.filter(t => t.level === lv);
  const levels = ['beginner','intermediate','advanced'];

  const startTest = (level) => navigation.navigate('TestPlay', { level });

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />
      <LinearGradient colors={[C.primary,'#0f1d35']} style={styles.header}>
        <Text style={styles.headerTitle}>✅ {t.tests}</Text>
        <Text style={styles.headerSub}>{TESTS.length}+ test soragy</Text>
      </LinearGradient>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {levels.map(lv => {
          const info = LEVEL_INFO[lv];
          const count = byLevel(lv).length;
          return (
            <View key={lv} style={[styles.levelCard, { borderLeftColor: info.color }]}>
              <LinearGradient colors={[info.bg, '#fff']} style={styles.levelCardInner} start={{x:0,y:0}} end={{x:1,y:0}}>
                <View style={styles.levelTop}>
                  <Text style={styles.levelIcon}>{info.icon}</Text>
                  <View style={styles.levelInfo}>
                    <Text style={[styles.levelLabel, { color: info.color }]}>{info.label}</Text>
                    <Text style={styles.levelCount}>{count} sany sorag</Text>
                  </View>
                  <View style={[styles.levelBadge, { backgroundColor: info.color }]}>
                    <Text style={styles.levelBadgeTxt}>{count}</Text>
                  </View>
                </View>

                <Text style={styles.levelDesc}>
                  {lv === 'beginner' && 'Iýmit, haýwanlar, reňkler, sanlar we esasy sözler'}
                  {lv === 'intermediate' && 'Saglyh, sport, tebigat we çylşyrymly sözler'}
                  {lv === 'advanced' && 'Grammatika, ylym, syýasat we ösen sözler'}
                </Text>

                <TouchableOpacity style={[styles.startBtn, { backgroundColor: info.color }]} onPress={() => startTest(lv)}>
                  <Text style={styles.startBtnTxt}>{t.startTest} →</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          );
        })}

        {/* Mixed test */}
        <View style={[styles.levelCard, { borderLeftColor: C.gold }]}>
          <LinearGradient colors={['#fffbe6','#fff']} style={styles.levelCardInner}>
            <View style={styles.levelTop}>
              <Text style={styles.levelIcon}>🎲</Text>
              <View style={styles.levelInfo}>
                <Text style={[styles.levelLabel, { color:'#b7791f' }]}>🌟 Garyşyk test</Text>
                <Text style={styles.levelCount}>{TESTS.length} sany sorag</Text>
              </View>
              <View style={[styles.levelBadge, { backgroundColor: C.gold }]}>
                <Text style={[styles.levelBadgeTxt, { color: C.primary }]}>{TESTS.length}</Text>
              </View>
            </View>
            <Text style={styles.levelDesc}>Ähli derejelerden garyşyk soraglar — öz derejeňi syna!</Text>
            <TouchableOpacity style={[styles.startBtn, { backgroundColor:'#b7791f' }]} onPress={() => startTest('all')}>
              <Text style={styles.startBtnTxt}>{t.startTest} →</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex:1, backgroundColor:C.bg },
  header: { paddingTop:50, paddingHorizontal:20, paddingBottom:20 },
  headerTitle: { color:'#fff', fontSize:22, fontWeight:'900' },
  headerSub: { color:'rgba(255,255,255,.5)', fontSize:13, marginTop:2 },
  body: { flex:1, padding:16 },
  levelCard: { backgroundColor:C.card, borderRadius:16, marginBottom:14, borderLeftWidth:5, overflow:'hidden', elevation:3, shadowColor:'#000', shadowOpacity:.08, shadowRadius:8, shadowOffset:{width:0,height:3} },
  levelCardInner: { padding:18 },
  levelTop: { flexDirection:'row', alignItems:'center', gap:12, marginBottom:10 },
  levelIcon: { fontSize:32 },
  levelInfo: { flex:1 },
  levelLabel: { fontSize:15, fontWeight:'800' },
  levelCount: { fontSize:12, color:C.light, marginTop:2 },
  levelBadge: { width:38, height:38, borderRadius:19, alignItems:'center', justifyContent:'center' },
  levelBadgeTxt: { color:'#fff', fontWeight:'900', fontSize:14 },
  levelDesc: { fontSize:13, color:C.light, lineHeight:18, marginBottom:14 },
  startBtn: { borderRadius:10, paddingVertical:11, alignItems:'center' },
  startBtnTxt: { color:'#fff', fontWeight:'800', fontSize:14 },
});
