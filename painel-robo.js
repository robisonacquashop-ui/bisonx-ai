/* ============================================================
   PAINEL ROBO BISONX - gerador de Expert Advisors (MQL5)
   Motor de geracao compartilhado (navegador + teste em Node)
   ============================================================ */

var TEMPLATE_TENDENCIA = String.raw`//+------------------------------------------------------------------+
//|                                           MeuRobo_Tendencia.mq5 |
//|                                 Gerado pelo BISONX em 2026.09.02 |
//+------------------------------------------------------------------+
#property copyright "BISONX"
#property version      "1.00"
#property strict

#include <Trade\Trade.mqh>
CTrade trade;

//---------------------- ENTRADA ----------------------
input int    FastPeriod = 10;   // Media rapida (periodos)
input int    SlowPeriod = 30;   // Media lenta (periodos)
input double LotSize    = __LOTE__; // Lote fixo
input int    MagicNum   = __MAGIC__; // Identificador

int    maFstd, maSstd;
double f[2], s[2];

int OnInit()
  {
   maFstd = iMA(_Symbol, _Period, FastPeriod, 0, MODE_SMA, PRICE_CLOSE);
   maSstd = iMA(_Symbol, _Period, SlowPeriod, 0, MODE_SMA, PRICE_CLOSE);
   if(maFstd==INVALID_HANDLE || maSstd==INVALID_HANDLE)
      return(INIT_FAILED);
   trade.SetExpertMagicNumber(MagicNum);
   return(INIT_SUCCEEDED);
  }

void OnTick()
  {
   if(CopyBuffer(maFstd,0,0,2,f)!=2) return;
   if(CopyBuffer(maSstd,0,0,2,s)!=2) return;
   bool subiu = (f[0]<=s[0] && f[1]>s[1]);
   bool caiu  = (f[0]>=s[0] && f[1]<s[1]);
   if(subiu && !_TemCompra(MagicNum)) _Abre("buy");
   if(caiu  && !_TemVenda(MagicNum)) _Abre("sell");
  }

//---------------------- AUXILIARES ----------------------
bool _TemCompra(int _magic)
  {
   for(int i=PositionsTotal()-1; i>=0; i--)
     {
       ulong t=PositionGetTicket(i);
       if(t==0) continue;
       if(PositionGetString(POSITION_SYMBOL)!=_Symbol) continue;
       if(PositionGetInteger(POSITION_MAGIC)!=_magic) continue;
       if(PositionGetInteger(POSITION_TYPE)==POSITION_TYPE_BUY)
          return(true);
     }
   return(false);
  }

bool _TemVenda(int _magic)
  {
   for(int i=PositionsTotal()-1; i>=0; i--)
     {
       ulong t=PositionGetTicket(i);
       if(t==0) continue;
       if(PositionGetString(POSITION_SYMBOL)!=_Symbol) continue;
       if(PositionGetInteger(POSITION_MAGIC)!=_magic) continue;
       if(PositionGetInteger(POSITION_TYPE)==POSITION_TYPE_SELL)
          return(true);
     }
   return(false);
  }

int _ContaAbertas(int _magic)
  {
   int c=0;
   for(int i=PositionsTotal()-1; i>=0; i--)
     {
       ulong t=PositionGetTicket(i);
       if(t==0) continue;
       if(PositionGetString(POSITION_SYMBOL)!=_Symbol) continue;
       if(PositionGetInteger(POSITION_MAGIC)!=_magic) continue;
       c++;
     }
   return(c);
  }

void _Abre(string tipo)
  {
   double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
   double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
   if(tipo=="buy")  trade.Buy(LotSize, _Symbol, ask, 0, 0, "BISONX");
   else               trade.Sell(LotSize, _Symbol, bid, 0, 0, "BISONX");
  }`;

var TEMPLATE_REVERSAO = String.raw`//+------------------------------------------------------------------+
//|                                           MeuRobo_RSI.mq5 |
//|                                 Gerado pelo BISONX em 2026.09.02 |
//+------------------------------------------------------------------+
#property copyright "BISONX"
#property version      "1.00"
#property strict

#include <Trade\Trade.mqh>
CTrade trade;

//---------------------- ENTRADA ----------------------
input int   RsiPeriod = 14;   // Periodo do RSI
input int   NivelSuperior = 70; // Sobrecompra
input int   NivelInferior = 30; // Sobrevenda
input double LotSize = __LOTE__;
input int   MagicNum = __MAGIC__;

int    hRsi;
double r[1];

int OnInit()
  {
   hRsi = iRSI(_Symbol, _Period, RsiPeriod, PRICE_CLOSE);
   if(hRsi==INVALID_HANDLE) return(INIT_FAILED);
   trade.SetExpertMagicNumber(MagicNum);
   return(INIT_SUCCEEDED);
  }

void OnTick()
  {
   if(CopyBuffer(hRsi,0,0,1,r)!=1) return;
   bool sobrecompra = (r[0] > NivelSuperior);
   bool sobrevenda  = (r[0] < NivelInferior);
   if(sobrevenda  && !_TemCompra(MagicNum)) _Abre("buy");
   if(sobrecompra && !_TemVenda(MagicNum)) _Abre("sell");
  }

//---------------------- AUXILIARES ----------------------
bool _TemCompra(int _magic)
  {
   for(int i=PositionsTotal()-1; i>=0; i--)
     {
       ulong t=PositionGetTicket(i);
       if(t==0) continue;
       if(PositionGetString(POSITION_SYMBOL)!=_Symbol) continue;
       if(PositionGetInteger(POSITION_MAGIC)!=_magic) continue;
       if(PositionGetInteger(POSITION_TYPE)==POSITION_TYPE_BUY)
          return(true);
     }
   return(false);
  }

bool _TemVenda(int _magic)
  {
   for(int i=PositionsTotal()-1; i>=0; i--)
     {
       ulong t=PositionGetTicket(i);
       if(t==0) continue;
       if(PositionGetString(POSITION_SYMBOL)!=_Symbol) continue;
       if(PositionGetInteger(POSITION_MAGIC)!=_magic) continue;
       if(PositionGetInteger(POSITION_TYPE)==POSITION_TYPE_SELL)
          return(true);
     }
   return(false);
  }

int _ContaAbertas(int _magic)
  {
   int c=0;
   for(int i=PositionsTotal()-1; i>=0; i--)
     {
       ulong t=PositionGetTicket(i);
       if(t==0) continue;
       if(PositionGetString(POSITION_SYMBOL)!=_Symbol) continue;
       if(PositionGetInteger(POSITION_MAGIC)!=_magic) continue;
       c++;
     }
   return(c);
  }

void _Abre(string tipo)
  {
   double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
   double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
   if(tipo=="buy")  trade.Buy(LotSize, _Symbol, ask, 0, 0, "BISONX");
   else               trade.Sell(LotSize, _Symbol, bid, 0, 0, "BISONX");
  }`;

var TEMPLATE_GRADE = String.raw`//+------------------------------------------------------------------+
//|                                           MeuRobo_Grade.mq5 |
//|                                 Gerado pelo BISONX em 2026.09.02 |
//+------------------------------------------------------------------+
#property copyright "BISONX"
#property version      "1.00"
#property strict

#include <Trade\Trade.mqh>
CTrade trade;

//---------------------- ENTRADA ----------------------
input double Passo       = 100.0;  // distancia em pontos
input int   MaxNiveis   = 5; // quantos niveis
input double LotSize    = __LOTE__;
input int    MagicNum    = __MAGIC__;

int OnInit()
  {
   trade.SetExpertMagicNumber(MagicNum);
   return(INIT_SUCCEEDED);
  }

void OnTick()
  {
   double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
   double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
   int n = _ContaAbertas(MagicNum);
   if(n < MaxNiveis && n==0)
     {
       trade.Buy(LotSize, _Symbol, ask, 0, 0, "grid");
       return;
     }
  }

//---------------------- AUXILIARES ----------------------
bool _TemCompra(int _magic)
  {
   for(int i=PositionsTotal()-1; i>=0; i--)
     {
       ulong t=PositionGetTicket(i);
       if(t==0) continue;
       if(PositionGetString(POSITION_SYMBOL)!=_Symbol) continue;
       if(PositionGetInteger(POSITION_MAGIC)!=_magic) continue;
       if(PositionGetInteger(POSITION_TYPE)==POSITION_TYPE_BUY)
          return(true);
     }
   return(false);
  }

bool _TemVenda(int _magic)
  {
   for(int i=PositionsTotal()-1; i>=0; i--)
     {
       ulong t=PositionGetTicket(i);
       if(t==0) continue;
       if(PositionGetString(POSITION_SYMBOL)!=_Symbol) continue;
       if(PositionGetInteger(POSITION_MAGIC)!=_magic) continue;
       if(PositionGetInteger(POSITION_TYPE)==POSITION_TYPE_SELL)
          return(true);
     }
   return(false);
  }

int _ContaAbertas(int _magic)
  {
   int c=0;
   for(int i=PositionsTotal()-1; i>=0; i--)
     {
       ulong t=PositionGetTicket(i);
       if(t==0) continue;
       if(PositionGetString(POSITION_SYMBOL)!=_Symbol) continue;
       if(PositionGetInteger(POSITION_MAGIC)!=_magic) continue;
       c++;
     }
   return(c);
  }

void _Abre(string tipo)
  {
   double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
   double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
   if(tipo=="buy")  trade.Buy(LotSize, _Symbol, ask, 0, 0, "BISONX");
   else               trade.Sell(LotSize, _Symbol, bid, 0, 0, "BISONX");
  }`;

var ESTRATEGIAS_KEY = ["tendencia", "reversao", "grade"];
var ESTRATEGIAS = {
  tendencia: {
    arquivo: "MeuRobo_Tendencia.mq5",
    icone: "\uD83D\uDCC8",
    nome: { PT: "Tendência", EN: "Trend", ES: "Tendencia" },
    desc: {
      PT: "Segue o movimento do mercado com médias móveis. O clássico dos robôs, ideal para iniciar.",
      EN: "Follows the market movement with moving averages. The classic robot, ideal to start.",
      ES: "Sigue el movimiento del mercado con medias móviles. El clásico de los robots, ideal para empezar."
    }
  },
  reversao: {
    arquivo: "MeuRobo_RSI.mq5",
    icone: "\uD83D\uDD04",
    nome: { PT: "Reversão (RSI)", EN: "Reversal (RSI)", ES: "Reversión (RSI)" },
    desc: {
      PT: "Caça os pontos de virada, quando o mercado está 'vendido' ou 'comprado' demais.",
      EN: "Catches the turning points when the market is oversold or overbought.",
      ES: "Caza los puntos de giro cuando el mercado está sobrevendido o sobrecomprado."
    }
  },
  grade: {
    arquivo: "MeuRobo_Grade.mq5",
    icone: "\uD83C\uDFAF",
    nome: { PT: "Fluxo (Grade)", EN: "Flow (Grid)", ES: "Flujo (Rejilla)" },
    desc: {
      PT: "Mantém uma operação por vez, do jeito simples. Bom para começar com calma.",
      EN: "Keeps one position open at a time, the simple way. Great for a calm start.",
      ES: "Mantiene una operación a la vez, de forma sencilla. Bueno para empezar con calma."
    }
  }
};

function _lotFiltrado(valor) {
  var n = parseFloat(String(valor).replace(",", "."));
  if (isNaN(n) || n < 0) return 0.01;
  if (n > 10) n = 10;
  return Math.round(n * 100) / 100;
}

function _nomeArquivo(tipo, nome) {
  var base = (nome && String(nome).trim()) || ESTRATEGIAS[tipo].arquivo.replace(".mq5", "");
  base = base.replace(/[^A-Za-z0-9_\-]/g, "_");
  return base + ".mq5";
}

function _magicNovo() {
  return 1 + Math.floor(Math.random() * 0x7fffffff);
}

function gerarMq5(tipo, lote, magic) {
  var tpl = tipo === "reversao" ? TEMPLATE_REVERSAO
          : tipo === "grade"   ? TEMPLATE_GRADE
          : TEMPLATE_TENDENCIA;
  var l = _lotFiltrado(lote).toFixed(2);
  return tpl.replace(/__LOTE__/g, l).replace(/__MAGIC__/g, String(magic));
}

function gerarInstalador(nomeArq) {
  return String.raw`@echo off
chcp 65001 >nul
title Instalar Meu Robo BISONX - 1 clique
color 0A
setlocal
set "ROBO=__NOME__"
set "TERM="
for /d %%D in ("%APPDATA%\MetaQuotes\Terminal\*") do (
  if exist "%%~D\MQL5\Experts" set "TERM=%%~D"
)
if not defined TERM (
  echo.
  echo  MetaTrader 5 nao encontrado neste computador.
  echo  Instale o MT5 em www.metatrader5.com e rode este arquivo de novo.
  echo.
  pause
  exit /b 1
)
copy /y "%~dp0__NOME__" "%TERM%\MQL5\Experts\__NOME__" >nul
set "ED=C:\Program Files\MetaTrader 5\MetaEditor64.exe"
if not exist "%ED%" if exist "C:\Program Files (x86)\MetaTrader 5\MetaEditor64.exe" set "ED=C:\Program Files (x86)\MetaTrader 5\MetaEditor64.exe"
echo.
echo  Compilando __NOME__ ... aguarde
"%ED%" /compile:"%TERM%\MQL5\Experts\__NOME__" /log:"%TERM%\MQL5\Experts\__NOME__.compilacao.log"
if exist "%TERM%\MQL5\Experts\__NOME__.compilacao.log" (
  findstr /C:"error" "%TERM%\MQL5\Experts\__NOME__.compilacao.log" >nul && (
    echo.
    echo  OCORREU UM ERRO NA COMPILACAO.
    echo  Envie este arquivo para o suporte: __NOME__.compilacao.log
  ) || (
    echo  COMPILADO COM SUCESSO - seu robo esta pronto!
  )
)
echo.
echo  Como usar no MT5:
echo   1. Abra o Navegador (tecla F10 ou Ctrl+N) e veja "Especialistas"
echo   2. Arraste __NOME__ para dentro do grafico
echo   3. Clique OK e depois permita a automacao (botao "Robot" na barra)
echo.
echo  Dica: teste antes em conta demo ou no Testador de Estrategia.
echo.
pause`.replace(/__NOME__/g, nomeArq);
}

function gerarPassos() {
  return String.raw`COMO INSTALAR SEU ROBO BISONX (1 minuto)
=========================================

1) Instale o MetaTrader 5 (www.metatrader5.com) se ainda nao tiver.
   Faca login na sua corretora e abra o grafico do seu ativo.

2) De dois cliques em INSTALAR.bat e aguarde uns segundos.
   Ele cola o robo na pasta certa do MT5 e COMPILA sozinho.

3) No MT5: painel Navegador (Ctrl+N) -> Especialistas ->
   arraste o arquivo do robo para dentro do grafico.

4) Na janelinha que abrir, deixe tudo normal e clique em OK.
   No topo da tela, clique em RECURSOS/AUTOMACAO -> "Permitir".

Pronto! O robo esta operando.

ATENCAO:
- Teste SEMPRE antes em conta demo ou no Testador de Estrategia.
- Trade tem risco. Use lote pequeno e nunca invista dinheiro
  que voce nao pode perder.
- Para mudar lote/parametros: clique duas vezes no robo no grafico.
`;
}

function montarArquivos(tipo, lote, nome) {
  var nomeArq = _nomeArquivo(tipo, nome);
  var magic = _magicNovo();
  var enc = new TextEncoder();
  return [
    { nome: nomeArq,              bytes: enc.encode(gerarMq5(tipo, lote, magic)) },
    { nome: "INSTALAR.bat",       bytes: enc.encode(gerarInstalador(nomeArq)) },
    { nome: "PASSOS.txt",         bytes: enc.encode(gerarPassos()) }
  ];
}

/* ------------------- ZIP (sem dependencias) ------------------- */
var _crcTab = (function () {
  var t = new Uint32Array(256);
  for (var n = 0; n < 256; n++) {
    var c = n;
    for (var k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c >>> 0;
  }
  return t;
})();

function _crc32(bytes) {
  var c = 0xFFFFFFFF, t = _crcTab;
  for (var i = 0; i < bytes.length; i++) c = t[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}
function _u16(n) { return [n & 0xFF, (n >> 8) & 0xFF]; }
function _u32(n) { return [n & 0xFF, (n >> 8) & 0xFF, (n >> 16) & 0xFF, (n >> 24) & 0xFF]; }
function _dosT() {
  var d = new Date();
  return ((d.getHours()) << 11) | ((d.getMinutes()) << 5) | (d.getSeconds() >> 1);
}
function _dosD() {
  var d = new Date();
  return ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
}

function fazerZip(arquivos) {
  var chunks = [], centro = [], offset = 0;
  var ver = [0x14, 0], flags = [0, 0], metodo = [0, 0];
  for (var a = 0; a < arquivos.length; a++) {
    var f = arquivos[a];
    var nb = new TextEncoder().encode(f.nome), data = f.bytes, crc = _crc32(data);
    var t = _u16(_dosT()), d = _u16(_dosD());
    var c4 = _u32(crc), l4 = _u32(data.length), n2 = _u16(nb.length);
    var lh = new Uint8Array([].concat(
      [0x50, 0x4b, 0x03, 0x04], ver, flags, metodo, t, d,
      c4, l4, l4, n2, [0, 0]));
    var ch = new Uint8Array([].concat(
      [0x50, 0x4b, 0x01, 0x02], [0x14, 0], ver, flags, metodo, t, d,
      c4, l4, l4, n2,
      [0, 0], [0, 0], [0, 0], [0, 0], [0, 0, 0, 0],
      _u32(offset)));
    chunks.push(lh); chunks.push(nb); chunks.push(data);
    centro.push(ch); centro.push(nb);
    offset += lh.length + nb.length + data.length;
  }
  var cdLen = 0;
  for (var c = 0; c < centro.length; c++) cdLen += centro[c].length;
  var n = _u16(arquivos.length), s4 = _u32(cdLen), o4 = _u32(offset);
  var eocd = new Uint8Array([].concat(
    [0x50, 0x4b, 0x05, 0x06], [0, 0], [0, 0], n, n, s4, o4, [0, 0]));
  return new Blob([].concat(chunks, centro, [eocd]), { type: "application/zip" });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { ESTRATEGIAS_KEY, ESTRATEGIAS, gerarMq5, gerarInstalador, gerarPassos, montarArquivos, fazerZip };
}