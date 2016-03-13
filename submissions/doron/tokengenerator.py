#!/usr/bin/python
from tabulate import tabulate
class State:
    
    #Constructor, add self on function for non-static methods / variables
    def __init__(self, transition, name):
        self.accept_state = False
        self.accept_num = 0
        self.transition = transition
        self.next_state = []
        self.name = name
    
class DFA:
    tokenlist = []
    
    def __init__(self, token, value):
        self.token = token
        self.value = value
        
    
    
    #transition (general)
    number = ['1','2','3','4','5','6','7','8','9','0']
    letter = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
    character = ['!','@','$','%','^','&','*','(',')','-','_','=','+','{','}','|',':',';','<','>','.',',','?','/','\'','\\']
    space = "\s"
    ident = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
    
    #in
    q102 = State(space,"Q102")
    q102.accept_state = True
    q102.accept_num = 28
    
   
    
    
    
    #identifier
    q101 = State(space,"Q101")
    q101.accept_state = True
    q101.accept_num = 1
    
    q100 = State(letter,"Q100")
    q100.transition.append(number)
    q100.next_state.append(q100)
    q100.next_state.append(q101)
    
    q99 = State(ident,"Q99")
    q99.next_state.append(q100)
    q99.next_state.append(q101)
    
    
    #comparison operation
    
    q98 = State(space,"Q98")
    q98.accept_state = True
    q98.accept_num = 27
    
    q97 = State(space,"Q97")
    q97.accept_state = True
    q97.accept_num = 26
    
    
    q96 = State(['='],"Q96")
    q96.next_state.append(q97)
    
    q95 = State(['<'],"Q95")
    q95.next_state.append(q96)
    q95.next_state.append(q97)
    
    q94 = State(['>'],"Q94")
    q94.next_state.append(q96)
    q94.next_state.append(q97)
   
    
    q93 = State(['!'],"Q93")
    q93.next_state.append(q96)
    
    q92 = State(['='],"Q92")
    q92.next_state.append(q96)
    q92.next_state.append(q98)
  
    #math operation
    q91 = State(space,"Q91")
    q91.accept_state = True
    q91.accept_num = 25
    
    q90 = State(['%'],"Q90")
    q90.next_state.append(q91)
    
    q89 = State(['/'],"Q89")
    q89.next_state.append(q91)
    
    q88 = State(['-'],"Q88")
    q88.next_state.append(q91)
    
    q87 = State(['*'],"Q87")
    q87.next_state.append(q91)
    
    q86 = State(['+'],"Q86")
    q86.next_state.append(q91)
    
    
    #close braces 
    q85 = State(['}'],"Q85")
    q85.accept_state = True
    q85.accept_num = 24
    
    
    #open braces
    q84 = State(['{'],"Q84")
    q84.accept_state = True
    q84.accept_num = 23
    
    #close_parenthesis
    q83 = State([')'],"Q83")
    q83.accept_state = True
    q83.accept_num = 22
    
    #open_parenthesis
    q82 = State(['('],"Q82")
    q82.accept_state = True
    q82.accept_num = 21
    
    #function 
    q81 = State(space,"Q81")
    q81.accept_state = True
    q81.accept_num = 20
    
    q80 = State(['n'],"Q80")
    q80.next_state.append(q81)
    
    q79 = State(['o'],"Q79")
    q79.next_state.append(q80)
    
    q78 = State(['i'],"Q78")
    q78.next_state.append(q79)
    
    q77 = State(['t'],"Q77")
    q77.next_state.append(q78)
    
    q76 = State(['c'],"Q76")
    q76.next_state.append(q77)
    
    q75 = State(['n'],"Q75")
    q75.next_state.append(q76)
    
    q74 = State(['u'],"Q74")
    q74.next_state.append(q75)
    
    #double
    q73 = State(space,"Q73")
    q73.accept_state = True
    q73.accept_num = 19
    
    q72 = State(number,"Q72")
    q72.next_state.append(q73)
    q72.next_state.append(q72)
    
    q71 = State(['.'],"Q71")
    q71.next_state.append(q72)
    
   
    
    #integer
    q70 = State(space,"Q70")
    q70.accept_state = True
    q70.accept_num = 18
    
    q69 = State(number,"Q69")
    q69.next_state.append(q70)
    q69.next_state.append(q69)
    q69.next_state.append(q71)
    
    #NOT
    q68 = State(space,"Q68")
    q68.accept_state = True
    q68.accept_num = 17
    
    q67 = State(['t'],"Q67")
    q67.next_state.append(q68)
    
    q66 = State(['o'],"Q66")
    q66.next_state.append(q67)
    
    q65 = State(['n'],"Q65")
    q65.next_state.append(q66)
    
    
    #AND
    q64 = State(space,"Q64")
    q64.accept_state = True
    q64.accept_num = 16
    
    q63 = State(['d'],"Q63")
    q63.next_state.append(q64)
    
    q62 = State(['n'],"Q62")
    q62.next_state.append(q63)
    
    q61 = State(['a'],"Q61")
    q61.next_state.append(q62)
    
    #OR
    q60 = State(space,"Q60")
    q60.accept_state = True
    q60.accept_num = 15
    
    q59 = State(['r'],"Q59")
    q59.next_state.append(q60)
    
    q58 = State(['o'],"Q58")
    q58.next_state.append(q59)
    
    
    #BOOL
    q57 = State(space,"Q57")
    q57.accept_state = True
    q57.accept_num = 14
    
    q56 = State(['l'],"Q56")
    q56.next_state.append(q57)
    
    q55 = State(['o'],"Q55")
    q55.next_state.append(q56)
    
    q54 = State(['o'],"Q54")
    q54.next_state.append(q55)
    
    q53 = State(['b'],"Q53")
    q53.next_state.append(q54)
    
    #STR
    q52 = State(space,"Q52")
    q52.accept_state = True
    q52.accept_num = 13
    
    q51 = State(['r'],"Q51")
    q51.next_state.append(q52)
    
    q50 = State(['t'],"Q50")
    q50.next_state.append(q51)
    
    q49 = State(['s'],"Q47")
    q49.next_state.append(q50)
    
    #DBL
    q48 = State(space,"Q48")
    q48.accept_state = True
    q48.accept_num = 12
    
    q47 = State(['l'],"Q47")
    q47.next_state.append(q48)
    
    q46 = State(['b'],"Q46")
    q46.next_state.append(q47)
    
    q45 = State(['d'],"Q45")
    q45.next_state.append(q46)
    
    
    #INT
    q44 = State(space,"Q44")
    q44.accept_state = True
    q44.accept_num = 11
    
    q43 = State(['t'],"Q43")
    q43.next_state.append(q44)
    
    q42 = State(['n'],"Q42")
    q42.next_state.append(q43)
    q42.next_state.append(q102)
    
    #FALSE 
    q41 = State(space,"Q41")
    q41.accept_state = True
    q41.accept_num = 10
    
    q40 = State(['e'],"Q40")
    q40.next_state.append(q41)
    
    q39 = State(['s'],"Q39")
    q39.next_state.append(q40)
    
    q38 = State(['l'],"Q37")
    q38.next_state.append(q39)
    
    q37 = State(['a'],"Q37")
    q37.next_state.append(q38)
    
    #TRUE
    q36 = State(space,"Q36")
    q36.accept_state = True
    q36.accept_num = 9
    
    q35 = State(['e'],"Q35")
    q35.next_state.append(q36)
    
    q34 = State(['u'],"Q34")
    q34.next_state.append(q35)
    
    q33 = State(['r'],"Q33")
    q33.next_state.append(q34)
    
    q32 = State(['t'],"Q32")
    q32.next_state.append(q33)
    
    #WHILE
    q31 = State(space,"Q31")
    q31.accept_state = True
    q31.accept_num = 8
    
    q30 = State(['e'],"Q30")
    q30.next_state.append(q31)
    
    q29 = State(['l'],"Q29")
    q29.next_state.append(q30)
    
    q28 = State(['i'],"Q28")
    q28.next_state.append(q29)
    
    q27 = State(['h'],"Q27")
    q27.next_state.append(q28)
    
    q26 = State(['w'],"Q26")
    q26.next_state.append(q27)
    
    #GET
    q25 = State(space,"Q25")
    q25.accept_state = True
    q25.accept_num = 7
    
    q24 = State(['t'],"Q24")
    q24.next_state.append(q25)
    
    q23 = State(['e'],"Q23")
    q23.next_state.append(q24)
    
    q22 = State(['g'],"Q22")
    q22.next_state.append(q23)
    
    #PRINT 
    q21 = State(space,"Q21")
    q21.accept_state = True
    q21.accept_num = 6

    q20 = State(['t'],"Q20")
    q20.next_state.append(q21)
    
    q19 = State(['n'],"Q19")
    q19.next_state.append(q20)
    
    q18 = State(['i'],"Q18")
    q18.next_state.append(q19)
    
    q17 = State(['r'],"Q17")
    q17.next_state.append(q18)
    
    q16 = State(['p'],"Q16")
    q16.next_state.append(q17)
    
    #ELSE IDENTIFIER
    
    q15 = State(space,"Q15")
    q15.accept_state = True
    q15.accept_num = 5
    
    q14 = State(['e'],"Q14")
    q14.next_state.append(q15)
    
    q13 = State(['s'],"Q13")
    q13.next_state.append(q14)

    q12 = State(['l'],"Q12")
    q12.next_state.append(q13)

    q11 = State(['e'],"Q11")
    q11.next_state.append(q12)
    #FOR IDENTIFIER
    q10 = State(space,"Q10")
    q10.accept_state = True
    q10.accept_num = 4
    
    q9 = State(['r'],"Q9")
    q9.next_state.append(q10)
    
    q8 = State(['o'],"Q8")
    q8.next_state.append(q9)
    
    q7 = State(['f'],"Q7")
    q7.next_state.append(q8)
    q7.next_state.append(q37)
    q7.next_state.append(q74)
    
    #IF IDENTIFIER
    #Q6
    q6 = State(space,"Q6")
    q6.accept_state = True
    q6.accept_num = 3
    
    #Q5
    q5 = State(['f'], "Q5")
    q5.next_state.append(q6)
    
    
    #Q4
    q4 = State(['i'], "Q4")
    q4.next_state.append(q5)
    q4.next_state.append(q42)
    

    #STRING IDENTIFIER
    #Q3
    q3 = State(['"'],"Q3")
    q3.accept_state = True
    q3.accept_num = 2
    
    
    #Q2
    q2 = State(letter,"Q2")
    q2.transition.append(number)
    q2.transition.append(character)
    q2.next_state.append(q2)
    q2.next_state.append(q3)
    
    
    #Q1
    q1 = State(['"'], "Q1") 
    q1.next_state.append(q2)
    
    #QNEG (WHITESPACE IDENTIFIER)
    
    qneg = State([' '], "QNEG")
    qneg.accept_state = True
    qneg.accept_num = -1
    
    #START STATE
    q0 = State(None, "Q0")
    q0.next_state.append(qneg)
    q0.next_state.append(q1)
    q0.next_state.append(q7)
    q0.next_state.append(q4)
    q0.next_state.append(q7)
    q0.next_state.append(q11)
    q0.next_state.append(q16)
    q0.next_state.append(q22)
    q0.next_state.append(q26)
    q0.next_state.append(q32)
    q0.next_state.append(q45)
    q0.next_state.append(q49)
    q0.next_state.append(q53)
    q0.next_state.append(q58)
    q0.next_state.append(q61)
    q0.next_state.append(q65)
    q0.next_state.append(q69)
    q0.next_state.append(q71)
    q0.next_state.append(q74)
    q0.next_state.append(q82)
    q0.next_state.append(q83)
    q0.next_state.append(q84)
    q0.next_state.append(q85)
    q0.next_state.append(q86)
    q0.next_state.append(q87)
    q0.next_state.append(q88)
    q0.next_state.append(q89)
    q0.next_state.append(q90)
    q0.next_state.append(q92)
    q0.next_state.append(q93)
    q0.next_state.append(q94)
    q0.next_state.append(q95)
    q0.next_state.append(q99)
    
    
    
    

    def checknext(state, input_letter):
        foundstate = False
        for states in state.next_state:
                #SPACE/WHITESPACE TESTING
                if states.name == "Q2"  or states.name == "Q6" or states.name == "Q10" or states.name == "Q15" or states.name == "Q21" or states.name == "Q25" or states.name == "Q31" or states.name == "QNEG" or states.name == "Q36" or states.name == "Q41" or states.name == "Q44" or states.name == "Q48" or states.name == "Q52" or states.name == "Q57" or states.name == "Q60" or states.name == "Q64" or states.name == "Q68" or states.name == "Q70" or states.name == "Q73" or states.name == "Q81" or states.name == "Q91" or states.name == "Q97" or states.name == "Q98" or states.name == "Q101" or states.name == "Q102":  
                    if input_letter.isspace():
                      #  print("FOUND NEXT STATE BLANK")
                        foundstate = True
                        state = states
                        
                #CHARACTER TESTING
                for transitions in states.transition:
                    for letters in transitions:
                       # print (letters)
                        if(letters == input_letter):
                            foundstate = True
                            #print("FOUND NEXT STATE")
                            state = states
        if foundstate == False:
            state = None
        return state
        
    def testinput(inputstr):
        #print("INPUT TO TEST", inputstr)
        state = DFA.q0
        startindex = 0
        currindex = 0
        for letter in inputstr:
            #print("Current State:",state.name)
            #print("Letter to test:",letter)
            state = DFA.checknext(state, letter)
            if state == None:
              #  print("Unrecognized Character. Exiting")
                return
            if state.accept_state == True:
                #print("END STATE", state.accept_num)
                tempstr = inputstr[startindex:currindex+1]
                DFA.addtoken(state.accept_num, tempstr)
                startindex = currindex+1
                state = DFA.q0
               
            currindex = currindex + 1
        DFA.printtokenlist()
    
    def addtoken(accept_num, tokenval):
        if(accept_num != -1):
            
            if(accept_num == 1):
                DFA.tokenlist.append(DFA("identifier", tokenval))
            if(accept_num == 2):
                DFA.tokenlist.append(DFA("string", tokenval))
            if(accept_num == 3):
                DFA.tokenlist.append(DFA("if", None))
            if(accept_num == 4):
                DFA.tokenlist.append(DFA("for", None))
            if(accept_num == 5):
                DFA.tokenlist.append(DFA("else", None))
            if(accept_num == 6):
                DFA.tokenlist.append(DFA("print", None))
            if(accept_num == 7):
                DFA.tokenlist.append(DFA("get", None))
            if(accept_num == 8):
                DFA.tokenlist.append(DFA("while", None))
            if(accept_num == 9):
                DFA.tokenlist.append(DFA("true", None))
            if(accept_num == 10):
                DFA.tokenlist.append(DFA("false", None))
            if(accept_num == 11):
                DFA.tokenlist.append(DFA("int", None))
            if(accept_num == 12):
                DFA.tokenlist.append(DFA("dbl", None))
            if(accept_num == 13):
                DFA.tokenlist.append(DFA("str", None))
            if(accept_num == 14):
                DFA.tokenlist.append(DFA("bool", None))
            if(accept_num == 15):
                DFA.tokenlist.append(DFA("or", None))
            if(accept_num == 16):
                DFA.tokenlist.append(DFA("and", None))
            if(accept_num == 17):
                DFA.tokenlist.append(DFA("not", None))
            if(accept_num == 18):
                DFA.tokenlist.append(DFA("integer literal", tokenval))
            if(accept_num == 19):
                DFA.tokenlist.append(DFA("double literal", tokenval))
            if(accept_num == 20):
                DFA.tokenlist.append(DFA("function", None))
            if(accept_num == 21):
                DFA.tokenlist.append(DFA("(", None))
            if(accept_num == 22):
                DFA.tokenlist.append(DFA(")", None))
            if(accept_num == 23):
                DFA.tokenlist.append(DFA("{", None))
            if(accept_num == 24):
                DFA.tokenlist.append(DFA("}", None))
            if(accept_num == 25):
                DFA.tokenlist.append(DFA("Mathematical Operation", tokenval))
            if(accept_num == 26):
                DFA.tokenlist.append(DFA("Comparison Operation", tokenval))
            if(accept_num == 27):
                DFA.tokenlist.append(DFA("=", None))
            if(accept_num == 28):
                DFA.tokenlist.append(DFA("int", None))
                
    def printtokenlist():
        table=[]
        
        
        for tokens in DFA.tokenlist:
            table.append([tokens.token, tokens.value])
            
        print (tabulate(table, headers=["Token","Value"]))

def loadfile(filename):
    
    obj = open(filename, "r")
    arr = obj.read()
    obj.close()
    
    return arr


def token_analyze(fa):
    "Universal DFA For Regex"
    
    DFA.testinput(fa)
    return 


def tokengenerator(filename):
    "This function generates a token list for a source code based on the grammar at grammar.md"
    fa =  loadfile(filename)
    token_analyze(fa)
    return 



#MAIN FUNCTION
tokengenerator("sourcecode.ds")