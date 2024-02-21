import { observer } from "mobx-react-lite";
import MyButtonInput from "./MyButtonInput";
import MyButton from "./MyButton";
import { useContext } from "react";
import { Context } from "..";

function Declaration() {

  const {store} = useContext(Context)
    
  function handleSubmit(e: any) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

    // You can pass formData as a fetch body directly:
    // fetch('/some-api', { method: form.method, body: formData });

    // Or you can work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
    console.log(formData);
    store.addDeclaration(formJson)
  }

  function cancel() {
    store.setCancelAction(true) // закрывается окно редактирования в Personale_page
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        <h2 style={{fontSize: "20px", textAlign: "center"}}>
          Декларация <br></br>
          моей Родной партии:
        </h2>
        
        <textarea
          id="text1"
          name="declaration"
          style={{fontSize: "14px"}}
          rows={20}
        />
      </label>
      <div style={{display: "flex"}}>
        <MyButton type="submit" text="Сохранить" /><MyButton type="reset" text="Отменить"  style={{background: "#bbbb50"}} func={cancel} />
      </div>
    </form>
  );
}


export default observer(Declaration);