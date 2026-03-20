import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLang } from '../navigation/LangContext';
import { REBUSES } from '../data/rebuses';

const C = { primary:'#1B2A4A', accent:'#4A90D9', gold:'#F5C518', bg:'#F0F4FF', card:'#fff', text:'#1a1a2e', light:'#8892b0' };

export default function RebusScreen({ navigation }) {
  const { t } = useLang();
  const levels = ['beginner','intermediate','advanced'];
  const LEVEL_INFO = {
    beginner:     { color:'#27ae60', bg:'#e8f8f0', icon:'🌱', label:'Başlangyç' },
    intermediate: { color:'#e67e22', bg:'#fef0e0', icon:'⚡', label:'Orta' },
    advanced:     { color:'#e74c3c', bg:'#fde8e8', icon:'🎯', label:'Ösen' },
  };

  const fillCount    = (lv) => REBUSES.filter(r => r.level===lv && r.type==='fill').length;
  const unscramCount = (lv) => REBUSES.filter(r => r.level===lv && r.type==='unscramble').length;

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />
      <LinearGradient colors={[C.primary,'#0f1d35']} style={styles.header}>
        <Text style={styles.headerTitle}>🧩 {t.rebuses}</Text>
        <Text style={styles.headerSub}>{REBUSES.length}+ rebus we söz oýny</Text>
      </LinearGradient>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {levels.map(lv => {
          const info = LEVEL_INFO[lv];
          const total = REBUSES.filter(r => r.level===lv).length;
          return (
            <View key={lv} style={[styles.card, { borderLeftColor: info.color }]}>
              <LinearGradient colors={[info.bg,'#fff']} style={styles.cardInner} start={{x:0}} end={{x:1}}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardIcon}>{info.icon}</Text>
                  <View style={styles.cardInfo}>
                    <Text style={[styles.cardLabel, { color: info.color }]}>{info.label}</Text>
                    <Text style={styles.cardCount}>{total} sany rebus</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: info.color }]}>
                    <Text style={styles.badgeTxt}>{total}</Text>
                  </View>
                </View>

                <View style={styles.typeRow}>
                  <View style={styles.typeChip}>
                    <Text style={styles.typeChipTxt}>✏️ Boş doldur: {fillCount(lv)}</Text>
                  </View>
                  <View style={styles.typeChip}>
                    <Text style={styles.typeChipTxt}>🔀 Harp düz: {unscramCount(lv)}</Text>
                  </View>
                </View>

                <View style={styles.btnRow}>
                  <TouchableOpacity style={[styles.typeBtn, { backgroundColor: info.color }]}
                    onPress={() => navigation.navigate('RebusPlay', { level: lv, type: 'fill' })}>
                    <Text style={styles.typeBtnTxt}>✏️ Boş doldur</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.typeBtn, { backgroundColor: info.color + 'cc' }]}
                    onPress={() => navigation.navigate('RebusPlay', { level: lv, type: 'unscramble' })}>
                    <Text style={styles.typeBtnTxt}>🔀 Harp düz</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={[styles.allBtn, { borderColor: info.color }]}
                  onPress={() => navigation.navigate('RebusPlay', { level: lv, type: 'all' })}>
                  <Text style={[styles.allBtnTxt, { color: info.color }]}>Ikisini hem oýna →</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          );
        })}

        {/* All rebuses */}
        <View style={[styles.card, { borderLeftColor: C.gold }]}>
          <LinearGradient colors={['#fffbe6','#fff']} style={styles.cardInner}>
            <View style={styles.cardTop}>
              <Text style={styles.cardIcon}>🎲</Text>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardLabel, { color:'#b7791f' }]}>🌟 Ähli rebus</Text>
                <Text style={styles.cardCount}>{REBUSES.length} sany rebus</Text>
              </View>
            </View>
            <Text style={styles.cardDesc}>Ähli derejelerden garyşyk rebus oýny!</Text>
            <TouchableOpacity style={[styles.allBtn, { borderColor:'#b7791f', backgroundColor:'#b7791f' }]}
              onPress={() => navigation.navigate('RebusPlay', { level:'all', type:'all' })}>
              <Text style={[styles.allBtnTxt, { color:'#fff' }]}>Garyşyk oýna →</Text>
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
  card: { backgroundColor:C.card, borderRadius:16, marginBottom:14, borderLeftWidth:5, overflow:'hidden', elevation:3, shadowColor:'#000', shadowOpacity:.08, shadowRadius:8, shadowOffset:{width:0,height:3} },
  cardInner: { padding:18 },
  cardTop: { flexDirection:'row', alignItems:'center', gap:12, marginBottom:12 },
  cardIcon: { fontSize:32 },
  cardInfo: { flex:1 },
  cardLabel: { fontSize:15, fontWeight:'800' },
  cardCount: { fontSize:12, color:C.light, marginTop:2 },
  badge: { width:38, height:38, borderRadius:19, alignItems:'center', justifyContent:'center' },
  badgeTxt: { color:'#fff', fontWeight:'900', fontSize:14 },
  typeRow: { flexDirection:'row', gap:8, marginBottom:12 },
  typeChip: { backgroundColor:'rgba(0,0,0,.05)', borderRadius:20, paddingHorizontal:10, paddingVertical:4 },
  typeChipTxt: { fontSize:11, color:C.light, fontWeight:'600' },
  btnRow: { flexDirection:'row', gap:8, marginBottom:8 },
  typeBtn: { flex:1, borderRadius:10, paddingVertical:10, alignItems:'center' },
  typeBtnTxt: { color:'#fff', fontWeight:'800', fontSize:12 },
  allBtn: { borderRadius:10, paddingVertical:10, alignItems:'center', borderWidth:1.5 },
  allBtnTxt: { fontWeight:'800', fontSize:13 },
  cardDesc: { fontSize:13, color:C.light, marginBottom:12 },
});
