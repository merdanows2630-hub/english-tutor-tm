import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../navigation/AuthContext';
import { useLang } from '../navigation/LangContext';
import { WORDS } from '../data/words';
import { TESTS } from '../data/tests';
import { REBUSES } from '../data/rebuses';

const C = { primary:'#1B2A4A', accent:'#4A90D9', gold:'#F5C518', bg:'#F0F4FF', card:'#fff', text:'#1a1a2e', light:'#8892b0' };

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const { t, lang, setLang } = useLang();

  const stats = [
    { icon:'📚', label: t.words, value: WORDS.length + '+', color:'#4A90D9' },
    { icon:'✅', label: t.tests, value: TESTS.length + '+', color:'#27ae60' },
    { icon:'🧩', label: t.rebuses, value: REBUSES.length + '+', color:'#e67e22' },
    { icon:'⭐', label: t.score, value: user?.score || 0, color:'#F5C518' },
  ];

  const cards = [
    { icon:'📖', label: t.dictionary, color:['#4A90D9','#1B2A4A'], screen:'Dictionary' },
    { icon:'✅', label: t.tests, color:['#27ae60','#1a6640'], screen:'Tests' },
    { icon:'🧩', label: t.rebuses, color:['#e67e22','#a84300'], screen:'Rebuses' },
    { icon:'👤', label: t.profile, color:['#9b59b6','#6c3483'], screen:'Profile' },
  ];

  const getLevelLabel = (score) => {
    if (score >= 500) return t.advanced;
    if (score >= 200) return t.intermediate;
    return t.beginner;
  };

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />
      <LinearGradient colors={[C.primary,'#0f1d35']} style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.welcome}>{t.welcome}</Text>
            <Text style={styles.username}>👤 {user?.name || user?.username}</Text>
          </View>
          <View style={styles.langBar}>
            {['tk','ru','en'].map(l => (
              <TouchableOpacity key={l} onPress={() => setLang(l)} style={[styles.langBtn, lang===l && styles.langActive]}>
                <Text style={[styles.langTxt, lang===l && styles.langActiveTxt]}>{l.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Score badge */}
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreNum}>⭐ {user?.score || 0}</Text>
          <Text style={styles.scoreLabel}>{getLevelLabel(user?.score || 0)}</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {/* Stats row */}
        <View style={styles.statsRow}>
          {stats.map((s, i) => (
            <View key={i} style={[styles.statCard, { borderTopColor: s.color }]}>
              <Text style={styles.statIcon}>{s.icon}</Text>
              <Text style={[styles.statVal, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick access cards */}
        <Text style={styles.sectionTitle}>📌 Menu</Text>
        <View style={styles.cardGrid}>
          {cards.map((c, i) => (
            <TouchableOpacity key={i} style={styles.menuCard} onPress={() => navigation.navigate(c.screen)} activeOpacity={0.85}>
              <LinearGradient colors={c.color} style={styles.menuGrad} start={{x:0,y:0}} end={{x:1,y:1}}>
                <Text style={styles.menuIcon}>{c.icon}</Text>
                <Text style={styles.menuLabel}>{c.label}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Word of the day */}
        <Text style={styles.sectionTitle}>💡 Günüň sözi</Text>
        <View style={styles.wotd}>
          {(() => {
            const word = WORDS[Math.floor(Date.now() / 86400000) % WORDS.length];
            return (
              <>
                <Text style={styles.wotdEn}>{word.en}</Text>
                <View style={styles.wotdRow}>
                  <Text style={styles.wotdTk}>🇹🇲 {word.tk}</Text>
                  <Text style={styles.wotdRu}>🇷🇺 {word.ru}</Text>
                </View>
                <Text style={styles.wotdCat}>#{word.category}</Text>
              </>
            );
          })()}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex:1, backgroundColor: C.bg },
  header: { paddingTop:50, paddingHorizontal:20, paddingBottom:24 },
  headerRow: { flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 },
  welcome: { color:'rgba(255,255,255,.6)', fontSize:13 },
  username: { color:'#fff', fontSize:18, fontWeight:'800', marginTop:2 },
  langBar: { flexDirection:'row', gap:4 },
  langBtn: { paddingHorizontal:9, paddingVertical:4, borderRadius:16, borderWidth:1, borderColor:'rgba(255,255,255,.2)' },
  langActive: { backgroundColor: C.gold, borderColor: C.gold },
  langTxt: { color:'rgba(255,255,255,.5)', fontSize:10, fontWeight:'700' },
  langActiveTxt: { color: C.primary },
  scoreBadge: { backgroundColor:'rgba(255,255,255,.08)', borderRadius:12, padding:12, flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  scoreNum: { color: C.gold, fontSize:20, fontWeight:'900' },
  scoreLabel: { color:'rgba(255,255,255,.6)', fontSize:13, fontWeight:'600' },
  body: { flex:1 },
  statsRow: { flexDirection:'row', padding:16, gap:8 },
  statCard: { flex:1, backgroundColor:C.card, borderRadius:12, padding:10, alignItems:'center', borderTopWidth:3, elevation:3, shadowColor:'#000', shadowOpacity:.08, shadowRadius:6, shadowOffset:{width:0,height:2} },
  statIcon: { fontSize:20, marginBottom:4 },
  statVal: { fontSize:16, fontWeight:'900' },
  statLabel: { fontSize:9, color:C.light, marginTop:2, textAlign:'center' },
  sectionTitle: { fontSize:15, fontWeight:'800', color:C.text, paddingHorizontal:16, marginBottom:10 },
  cardGrid: { flexDirection:'row', flexWrap:'wrap', paddingHorizontal:16, gap:10, marginBottom:20 },
  menuCard: { width:'47%', borderRadius:16, overflow:'hidden', elevation:4, shadowColor:'#000', shadowOpacity:.15, shadowRadius:8, shadowOffset:{width:0,height:4} },
  menuGrad: { padding:20, alignItems:'center', justifyContent:'center', minHeight:90 },
  menuIcon: { fontSize:30, marginBottom:8 },
  menuLabel: { color:'#fff', fontSize:13, fontWeight:'800' },
  wotd: { marginHorizontal:16, backgroundColor:C.card, borderRadius:16, padding:20, elevation:4, shadowColor:'#000', shadowOpacity:.1, shadowRadius:8, shadowOffset:{width:0,height:4}, borderLeftWidth:4, borderLeftColor: C.accent },
  wotdEn: { fontSize:28, fontWeight:'900', color:C.primary, marginBottom:10 },
  wotdRow: { flexDirection:'row', gap:20, marginBottom:8 },
  wotdTk: { fontSize:15, fontWeight:'700', color:C.accent },
  wotdRu: { fontSize:15, fontWeight:'700', color:'#8e44ad' },
  wotdCat: { fontSize:11, color:C.light, fontStyle:'italic' },
});
