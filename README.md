<center>
    <img src="./shark.ico" />
    <h1 style="font-size:32px;font-weight: bold;"> BioAutomation  </h1>
</center>

O <b><i>BioAutomation</i></b> é um conjunto de softwares voltados para facilitar a análise de resultados provenientes de diversos algoritmos.<br><br>
Quando vamos realizar uma análise <b><i>in-silico</b></i> de uma determinada mutação <i>missense</i> com um determinado grupo de algoritmos, utilizamos uma série de <i>inputs</i> para cada tipo de algoritmo. Cada algoritmo possui seu próprio <i>input</i> em seus respectivos formatos. Quando temos o resultado, cada algoritmo tem um <i>output</i> com os seus respectivos formatos. <b>O objetivo do BioAutomation é facilitar a formação, gerenciamento e análise desses arquivos.</b>


## Front-End
O front-end está sendo construido utilizando Electron e AngularJS. Ele é a responsável por gerar a tela de interação com o usuário e realizar os chamados para a aplicação responsável por lidar com os dados quando for necessário.
## Back-End
O back-end está sendo totalmente escrito em python, visto que há uma grande necessidade de processamento de um alto volume de dados.

<em>A aplicação é dividida em duas tecnologias para retirarmos o maior proveito de cada uma delas e entregar um software de qualidade.</em>

### Resultado Final
Como resultado, teremos um único instalador para windows que será distribuído para os clientes. Esse instalador realizará a instalação dos dois softwares sem que o cliente precise fazer qualquer configuração adicional. Na realidade, no final, o cliente não saberá da existencia de uma determinada divisão, visto que ambos os softwares funcionarão como um só.