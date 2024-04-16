interface Props {
    id?: string;
    nameDiv?: string;
    name?: string;
    src: string;
    func: () => void;
  }

function MyButtonIcon(props: Props) {

    return (
        <button className={props.nameDiv}>
            <img className={props.name} id={props.id} src={props.src} alt={props.name} onClick={props.func}/>
        </button>
    );

}

export default MyButtonIcon;

