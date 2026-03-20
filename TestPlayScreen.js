import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, StatusBar, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../navigation/AuthContext';
import { useLang } from '../navigation/LangContext';
import { TESTS } from '../data/tests';

const C = { primary:'#1B2A4A', accent:'#4A90D9', gold:'#F5C518', bg:'#F0F4FF', card:'#fff', text:'#1a1a2e', light:'#8892b0', ok:'#27ae60', err:'#e74c3c' };

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length-1; i>0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

export default function TestPlayScreen({ route, navigation }) {
  const { level } = route.params;
  const { addScore } = useAuth();
  const { t } = useLang();

  const questions = useCallback(() => {
    const pool = level === 'all' ? TESTS : TESTS.filter(t => t.level === level);
    return shuffle(pool).slice(0, Math.min(20, pool.length));
  }, [level])();

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [done, setDone] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));

  const q = questions[idx];
  const total = questions.length;
  const progress = (idx / total) * 100;

  const pickAnswer = (opt) => {
    if (selected) return;
    setSelected(opt);
    if (opt === q.answer) {
      setCorrect(c => c + 1);
    } else {
      setWrong(w => w + 1);
    }
  };

  const next = async () => {
    if (idx + 1 >= total) {
      const pts = correct * 10;
      await addScore(pts);
      setDone(true);
    } else {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue:0, duration:150, useNativeDriver:true }),
        Animated.timing(fadeAnim, { toValue:1, duration:200, useNativeDriver:true }),
      ]).start();
      setIdx(i => i + 1);
      setSelected(null);
    }
  };

  const getOptStyle = (opt) => {
    if (!selected) return styles.optBtn;
    if (opt === q.answer) return [styles.optBtn, styles.optCorrect];
    if (opt === selected) return [styles.optBtn, styles.optWrong];
    return [styles.optBtn, styles.optDim];
  };
  const getOptTxtStyle = (opt) => {
    if (!selected) return styles.optTxt;
    if (opt === q.answer || opt === selected) return [styles.optTxt, { color:'#fff', fontWeight:'800' }];
    return [styles.optTxt, { color: C.light }];
  };

  const percentage = Math.round((correct / total) * 100);
  const grade = percentage >= 80 ? '🏆 Ajaýyp!' : percentage >= 60 ? '👍 Gowy!' : percentage >= 40 ? '📚 Dowam et' : '💪 Kän öwren';

  if (done) {
    return (
      <View style={styles.flex}>
        <StatusBar barStyle="light-content" />
        <LinearGradient colors={[C.primary,'#0f1d35']} style={styles.flex}>
          <View style={styles.resultBox}>
            <Text style={styles.resultEmoji}>{percentage >= 80 ? '🏆' : percentage >= 60 ? '⭐' : '📚'}</Text>
            <Text style={styles.resultTitle}>{t.result}</Text>
            <Text style={styles.resultGrade}>{grade}</Text>

            <View style={styles.resultStats}>
              <View style={styles.statItem}>
                <Text style={[styles.statNum, { color: C.ok }]}>{correct}</Text>
                <Text style={styles.statLbl}>✅ Dogry</Text>
              </View>
              <View style={[styles.statItem, styles.statCenter]}>
                <Text style={[styles.statNum, { color: C.gold }]}>{percentage}%</Text>
                <Text style={styles.statLbl}>Netije</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNum, { color: C.err }]}>{wrong}</Text>
                <Text style={styles.statLbl}>❌ Nädogry</Text>
              </View>
            </View>

            <Text style={styles.earnedPts}>+{correct * 10} bal gazandyň! ⭐</Text>

            <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.doneBtnTxt}>← Yza</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[C.primary,'#0f1d35']} style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.topCenter}>
          <Text style={styles.topCount}>{idx+1} / {total}</Text>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>
        <View style={styles.scoreRow}>
          <Text style={styles.scoreText}>✅{correct} ❌{wrong}</Text>
        </View>
      </LinearGradient>

      <Animated.View style={[styles.qBox, { opacity: fadeAnim }]}>
        <View style={[styles.levelPill, { backgroundColor: q.level==='beginner'?'#e8f8f0':q.level==='intermediate'?'#fef0e0':'#fde8e8' }]}>
          <Text style={[styles.levelPillTxt, { color: q.level==='beginner'?'#27ae60':q.level==='intermediate'?'#e67e22':'#e74c3c' }]}>
            {q.level}
          </Text>
        </View>
        <Text style={styles.qText}>{q.en}</Text>
      </Animated.View>

      <View style={styles.optsWrap}>
        {q.options.map((opt, i) => (
          <TouchableOpacity key={i} style={getOptStyle(opt)} onPress={() => pickAnswer(opt)} activeOpacity={0.85}>
            {selected && opt === q.answer && (
              <LinearGradient colors={['#27ae60','#1a7a45']} style={StyleSheet.absoluteFillObject} borderRadius={14} />
            )}
            {selected && opt === selected && opt !== q.answer && (
              <LinearGradient colors={['#e74c3c','#a93226']} style={StyleSheet.absoluteFillObject} borderRadius={14} />
            )}
            <Text style={styles.optLetter}>{String.fromCharCode(65+i)}</Text>
            <Text style={getOptTxtStyle(opt)}>{opt}</Text>
            {selected && opt === q.answer && <Ionicons name="checkmark-circle" size={20} color="#fff" />}
            {selected && opt === selected && opt !== q.answer && <Ionicons name="close-circle" size={20} color="#fff" />}
          </TouchableOpacity>
        ))}
      </View>

      {selected && (
        <View style={styles.feedback}>
          <Text style={[styles.feedbackTxt, { color: selected===q.answer ? C.ok : C.err }]}>
            {selected === q.answer ? `✅ ${t.correct}` : `❌ ${t.wrong} Dogrysy: "${q.answer}"`}
          </Text>
          <TouchableOpacity style={styles.nextBtn} onPress={next}>
            <LinearGradient colors={[C.accent, C.primary]} style={styles.nextGrad} start={{x:0,y:0}} end={{x:1,y:0}}>
              <Text style={styles.nextTxt}>{idx+1>=total ? t.finish : t.next} →</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex:1, backgroundColor:C.bg },
  topBar: { paddingTop:50, paddingHorizontal:16, paddingBottom:14, flexDirection:'row', alignItems:'center', gap:12 },
  backBtn: { padding:6 },
  topCenter: { flex:1 },
  topCount: { color:'rgba(255,255,255,.7)', fontSize:12, marginBottom:4, textAlign:'center' },
  progressBar: { height:6, backgroundColor:'rgba(255,255,255,.15)', borderRadius:3, overflow:'hidden' },
  progressFill: { height:'100%', backgroundColor:C.gold, borderRadius:3 },
  scoreRow: {},
  scoreText: { color:'#fff', fontSize:11, fontWeight:'700' },
  qBox: { margin:16, backgroundColor:C.card, borderRadius:20, padding:20, minHeight:120, justifyContent:'center', elevation:4, shadowColor:'#000', shadowOpacity:.1, shadowRadius:10, shadowOffset:{width:0,height:4} },
  levelPill: { alignSelf:'flex-start', paddingHorizontal:10, paddingVertical:3, borderRadius:20, marginBottom:10 },
  levelPillTxt: { fontSize:11, fontWeight:'700' },
  qText: { fontSize:18, fontWeight:'800', color:C.text, lineHeight:26 },
  optsWrap: { paddingHorizontal:16, gap:10 },
  optBtn: { flexDirection:'row', alignItems:'center', gap:12, backgroundColor:C.card, borderRadius:14, paddingVertical:14, paddingHorizontal:16, elevation:2, shadowColor:'#000', shadowOpacity:.06, shadowRadius:6, shadowOffset:{width:0,height:2}, overflow:'hidden' },
  optCorrect: { borderWidth:2, borderColor:'#27ae60' },
  optWrong: { borderWidth:2, borderColor:'#e74c3c' },
  optDim: { opacity:0.5 },
  optLetter: { width:26, height:26, borderRadius:13, backgroundColor:'#f0f4ff', textAlign:'center', lineHeight:26, fontSize:12, fontWeight:'800', color:C.accent },
  optTxt: { flex:1, fontSize:15, fontWeight:'700', color:C.text },
  feedback: { position:'absolute', bottom:0, left:0, right:0, backgroundColor:C.card, padding:16, borderTopLeftRadius:20, borderTopRightRadius:20, elevation:10, shadowColor:'#000', shadowOpacity:.15, shadowRadius:12, shadowOffset:{width:0,height:-4} },
  feedbackTxt: { fontSize:14, fontWeight:'700', marginBottom:12, textAlign:'center' },
  nextBtn: { borderRadius:12, overflow:'hidden' },
  nextGrad: { paddingVertical:14, alignItems:'center' },
  nextTxt: { color:'#fff', fontWeight:'800', fontSize:15 },
  // Result screen
  resultBox: { flex:1, alignItems:'center', justifyContent:'center', padding:32 },
  resultEmoji: { fontSize:72, marginBottom:16 },
  resultTitle: { color:'rgba(255,255,255,.6)', fontSize:16, marginBottom:8 },
  resultGrade: { color:'#fff', fontSize:26, fontWeight:'900', marginBottom:30 },
  resultStats: { flexDirection:'row', backgroundColor:'rgba(255,255,255,.1)', borderRadius:16, padding:20, width:'100%', marginBottom:20 },
  statItem: { flex:1, alignItems:'center' },
  statCenter: { borderLeftWidth:1, borderRightWidth:1, borderColor:'rgba(255,255,255,.15)' },
  statNum: { fontSize:28, fontWeight:'900', marginBottom:4 },
  statLbl: { color:'rgba(255,255,255,.5)', fontSize:12 },
  earnedPts: { color:C.gold, fontSize:18, fontWeight:'800', marginBottom:30 },
  doneBtn: { backgroundColor:'rgba(255,255,255,.15)', borderRadius:14, paddingVertical:14, paddingHorizontal:40 },
  doneBtnTxt: { color:'#fff', fontWeight:'800', fontSize:15 },
});
