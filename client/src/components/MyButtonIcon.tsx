interface Props {
    name: string;
    src: string;
    func: () => void;
  }

function MyButtonIcon(props: Props) {

    return (
        <button className={props.name}>
            <img className={`${props.name}_image`} src={props.src} alt={props.name} onClick={props.func}/>
        </button>
    );

}

export default MyButtonIcon;

