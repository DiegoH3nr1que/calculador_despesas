import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [transactionType, setTransactionType] = useState("expense");
  const [transactionName, setTransactionName] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionPaidBy, setTransactionPaidBy] = useState("Pix");

  useEffect(() => {
    const storedTransactions =
      JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(storedTransactions);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem("transactions", JSON.stringify(transactions));
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [transactions]);

  const handleTransactionTypeChange = (type) => {
    setTransactionType(type);
  };

  const handleTransactionNameChange = (event) => {
    setTransactionName(event.target.value);
  };

  const handleTransactionAmountChange = (event) => {
    setTransactionAmount(event.target.value);
  };

  const handleTransactionPaidBy = (type) => {
    setTransactionPaidBy(type);
  };

  const handleAddTransaction = () => {
    if (transactionName && transactionAmount) {
      const newTransaction = {
        id: new Date().getTime(),
        type: transactionType,
        name: transactionName,
        paid_by: transactionPaidBy,
        amount: parseFloat(transactionAmount),
      };

      setTransactions([...transactions, newTransaction]);
      setTransactionName("");
      setTransactionAmount("");
    }
  };

  const handleDeleteItem = (id, type) => {
    const updatedTransactions = transactions.filter(
      (transaction) => !(transaction.id === id && transaction.type === type)
    );

    setTransactions(updatedTransactions);
  };

  const getTotal = (type) => {
    return transactions
      .filter((transaction) => transaction.type === type)
      .reduce((total, transaction) => total + transaction.amount, 0)
      .toFixed(2);
  };

  const getBalance = () => {
    const totalIncome = getTotal("income");
    const totalExpense = getTotal("expense");
    const balance = totalIncome - totalExpense;
    return balance.toFixed(2);
  };

  return (
    <div className="container">
      <div className="section">
        <h2>HISTÓRICO PESSOAL</h2>
        <label>
          Tipo:
          <select
            value={transactionType}
            onChange={(e) => handleTransactionTypeChange(e.target.value)}
            className="input"
          >
            <option value="expense">Despesa</option>
            <option value="income">Receita</option>
          </select>
        </label>
        <br />
        <label>
          Nome:
          <input
            type="text"
            value={transactionName}
            onChange={handleTransactionNameChange}
            className="input"
          />
        </label>
        <br />
        <label>
          Valor:
          <input
            type="number"
            value={transactionAmount}
            onChange={handleTransactionAmountChange}
            className="input"
          />
        </label>
        <br />
        <label>
          Tipo de Pagamento:
          <select
            value={transactionPaidBy}
            onChange={(e) => handleTransactionPaidBy(e.target.value)}
            className="input"
          >
            <option value="Pix">Pix</option>
            <option value="Débito">Débito</option>
            <option value="Crédito">Crédito</option>
            <option value="Dinheiro">Dinheiro</option>

          </select>
        </label>
        <br />
        <button onClick={handleAddTransaction} className="button2">
          Adicionar Transação
        </button>
      </div>
      <div className="section">
        <h2>DESPESAS</h2>
        <ul>
          {transactions
            .filter((transaction) => transaction.type === "expense")
            .map((transaction) => (
              <li key={transaction.id} className="transitionItem">
                {transaction.name}: R$ {transaction.amount.toFixed(2)} 
                <br/>
                 Tipo de Pagamento: {transaction.paid_by}
                <button
                  className="button1"
                  onClick={() => handleDeleteItem(transaction.id, "expense")}
                >
                  Deletar
                </button>
              </li>
            ))}
        </ul>
        <p>Valor total de Despesas: R$ {getTotal("expense")}</p>
      </div>
      <div className="section">
        <h2>RECEITAS</h2>
        <ul>
          {transactions
            .filter((transaction) => transaction.type === "income")
            .map((transaction) => (
              <li key={transaction.id} className="transitionItem">
                {transaction.name}: R$ {transaction.amount.toFixed(2)} 
                <br/>
                Tipo de Pagamento: {transaction.paid_by}
                <button
                  className="button1"
                  onClick={() => handleDeleteItem(transaction.id, "income")}
                >
                  Deletar
                </button>
              </li>
            ))}
        </ul>
        <p> Valor total de Receitas: R$ {getTotal("income")}</p>
      </div>
      <div className="section_half-width">
        <h2>SALDO DA CARTEIRA</h2>
        <p>Saldo Total: R$ {getBalance()}</p>
      </div>
    </div>
  );
}

export default App;
