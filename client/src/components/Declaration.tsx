import { observer } from "mobx-react-lite";
import MyButtonInput from "./MyButtonInput";
import MyButton from "./MyButton";
import { useContext } from "react";
import { Context } from "..";

function Declaration() {

  const {store} = useContext(Context)
    
  async function handleSubmit(e: any) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    
    await store.addDeclaration(formJson)
    store.setCancelAction(true) // закрывается окно редактирования в Personale_page
  }

  function cancel() {
    store.setCancelAction(true) // закрывается окно редактирования в Personale_page
  }

  function handleKeyDown (e: any) {
    if (e.key === 'Tab') {
        e.preventDefault();
        const textArea = e.currentTarget; // or use document.querySelector('#my-textarea');
        textArea.setRangeText(
          '\t',
          textArea.selectionStart,
          textArea.selectionEnd,
          'end'
        );
      }
    };

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        <h2 style={{fontSize: "20px", textAlign: "center"}}>
          Декларация <br></br>
          моей Родной партии:
        </h2>
        <input type="hidden" name="id" value={store.user.id}/>
        <input type="hidden" name="secret" value={store.user.secret.secret}/>
        
        <textarea
          id="text1"
          name="declaration"
          style={{fontSize: "14px"}}
          rows={20}
          defaultValue={store.user.declaration?.declaration}
           onKeyDown={handleKeyDown}
        />
      </label>
      <div style={{display: "flex"}}>
        <MyButton type="submit" text="Сохранить" /><MyButton type="reset" text="Отменить"  style={{background: "#bbbb50"}} func={cancel} />
      </div>
    </form>
  );
}


export default observer(Declaration);