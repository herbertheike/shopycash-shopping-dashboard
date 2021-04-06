import React from "react";
import Modal from "react-modal";
import {
  Section,
  Input,
  Button,
  Title,
  Label,
  EditBt,
  DeleteBt,
  InputFile,
  Img,
  TextArea
} from "../../dashboard/loja/style";
import history from "../../history";
import { DashboardLoja } from "../../components/Layout";
import Icon from "awesome-react-icons";
import noimage from "../../imgsrc/logopad.jpg";

class CadastroCat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      token: localStorage.getItem("@token"),
      message: "",
      messageloja: "",
      ischecked: false,

      _id: "",
      lojaid: localStorage.getItem("@lojaid"),
      nome: "",
      categoria: "",
      categorialist: [],

      nomefantasiaedit: "",
      razaosocialedit: "",
      shoppingedit: "",
      cnpjedit: "",
      emailedit: "",
      siteedit: "",
      telefoneedit: "",
      responsaveledit: "",
      lojaslugedit: "",

      lojadata: [],
      prodarray: [],
      isModalOpen: false,
      isModalDelOpen: false,
      customStyles: {
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
        }}
    };
    this.handleChange = this.handleChange.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.closeDelModal = this.closeDelModal.bind(this);
    this.onImageChange = this.onImageChange.bind(this);
    this.onImage2Change = this.onImage2Change.bind(this);
    this.handleChecked = this.handleChecked.bind(this);

    // this.fileInput = React.createRef();
    //this.handleUploadImage = this.handleUploadImage.bind(this);
  }

  componentDidMount () {
    this.listcategorias();
    fetch(
      "https://api-shopycash1.herokuapp.com/indexproductby/"
      +localStorage.getItem("@lojaid")
    )
      .then((res) => res.json())
      .then((result) => this.setState({ prodarray: result }))
      .catch((error) => console.log(error))
      .finally(() => this.setState({ isLoaded: false }), []);
      
      fetch("https://api-shopycash1.herokuapp.com/indexstoreby/"
      +localStorage.getItem("@lojaid"),{                                                                          
      })
        .then((res) => res.json())
        .then(function(result){
          localStorage.setItem("@loja", result.nomefantasia)
          localStorage.setItem("@shopping", result.shopping)
        })
        .catch((error) => console.log(error))
        .finally(() => this.setState({ isLoaded: false }), []);
  }
  openModal = async (
    nome,
    endereco,
    cnpj,
    telefone,
    email,
    site,
    responsavel,
    shoppingslug
  ) => {
    this.setState({
      isModalOpen: true,
      nomeedit: nome,
      enderecoedit: endereco,
      cnpjedit: cnpj,
      telefoneedit: telefone,
      emailedit: email,
      siteedit: site,
      responsaveledit: responsavel,
      shoppingslugedit: shoppingslug,
    });
  };
  openModalDelete = async (item) => {
    this.setState({
      isModalDelOpen: true,
    });
    const id = item;
    this.setState({ _id: id }, () => console.log(this.state._id));
  };
  afterOpenModal() {
    // references are now sync'd and can be accessed.
    //subtitle.style.color = '#f00';
  }
  closeModal() {
    this.setState({ isModalOpen: false });
  }
  closeDelModal() {
    this.setState({ isModalDelOpen: false });
  }
  deleteloja = async (item) => {
    const _id = item;
    console.log(_id, "new id");
    await fetch("https://api-shopycash1.herokuapp.com/deletestore/" + _id, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("@token"),
      },
    })
      .then((res) =>
        res.json(localStorage.setItem("@delmessage", JSON.stringify(res)))
      )
      .catch((error) => console.log(error))
      .finally(() => this.setState({ isLoaded: false }));

    window.location.reload();
  };

  cadastrarproduto = async () => {
    const payload = JSON.stringify({
      loja_id: this.state.lojaid,
      nome: this.state.nome,
      desc: this.state.desc,
      preco: this.state.preco,
      loja: this.state.loja,
      shopping: this.state.shopping,
      shoppingid: this.state.shoppingid,
      categoria: this.state.categoria,
      ativo: this.state.ativo,
      imagem: this.state.imagembase64,
      imagem2: this.state.imagem2base64,
      estoque: this.state.estoque,
    });

    await fetch(
      "https://api-shopycash1.herokuapp.com/stores/insertprod/" +
      localStorage.getItem("@lojaid"),
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("@token"),
        },
        body: payload,
      }
    )
      .then((res) => res.json())
      .then((res) => localStorage.setItem("@prodcad", res))
      .catch((error) => {
        localStorage.setItem("@error", error);
        console.log(error);
      });
    //this.cadastrausuario();

    window.location.reload();
  
  };

  updateloja = async () => {
    const lojaslugedit = this.state.lojaslugedit;
    console.log("SHOPPING--> " + lojaslugedit);
    await fetch(
      "https://api-shopycash1.herokuapp.com/updatestore/" + lojaslugedit,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json, multipart/form-data",
          Authorization: "Bearer " + localStorage.getItem("@token"),
        },
        body: JSON.stringify({
          nomefantasia: this.state.nomefantasia,
          razaosocial: this.state.razaosocial,
          shopping: this.state.shopping,
          cnpj: this.state.cnpj,
          email: this.state.email,
          site: this.state.site,
          telefone: this.state.telefone,
          responsavel: this.state.responsavel,
          lojaslug: this.state.lojaslug,
        }),
      }
    )
      .then((res) => res.json(console.log(JSON.stringify(res))))
      .then((res) => localStorage.setItem("@message", JSON.stringify(res)))
      .catch((error) => {
        localStorage.setItem("@message", error);
        console.log(error);
      });

    window.location.reload();
  };

  logout() {
    try {
      localStorage.removeItem("@token");
      localStorage.clear();
      history.push("/");
    } catch (error) { }
  }

  handleChange = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target;
    const type = target.type;
    const value = target.value;
    const name = target.name;

    if (type === "file") {
      this.setState({ [name]: event.target.files });
    } else {
      this.setState({
        [name]: value,
      });
    }
  };

  onImageChange(event) {
    event.preventDefault();
    console.log("Imagem1:\n", event.target.files[0]);
    let file = event.target.files[0];
    let baseurl = "";

    if (file) {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => {
        baseurl = reader.result;
        console.log(baseurl);
        this.setState({ imagembase64: baseurl });
        //this._handleReaderLogo.bind(this)};
      };
    }
  }

  onImage2Change(event) {
    event.preventDefault();
    console.log("CAPA:\n", event.target.files[0]);
    let file = event.target.files[0];
    let baseurl = "";

    if (file) {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => {
        baseurl = reader.result;
        console.log(baseurl);
        this.setState({ imagem2base64: baseurl });
      };
    }
  }

  listcategorias() {
    fetch("https://api-shopycash1.herokuapp.com/indexcategory/"+localStorage.getItem("@lojaid"))
      .then((res) => res.json())
      .then((result) => this.setState({ categorialist: result }))
      .catch((error) => console.log(error))
      .finally(() => this.setState({ isLoaded: false }), []);
  }

  handleChecked(event) {
    console.log(event);
    let newcheck = "";
    if (this.state.categoria.length <= 0 && event.target.checked) {
      newcheck = event.target.value;
      this.setState({ categoria: [newcheck] });
    } else if (this.state.categoria.length > 0 && event.target.checked) {
      newcheck = event.target.value;
      this.setState({ categoria: [...this.state.categoria, newcheck] });
    }
    let array = [...this.state.categoria]
    let index = array.indexOf(event.target.value)
    if(event.target.checked === false){
      array.splice(index,1)
      this.setState({categoria:array})
    }
  }

  /*-----------------------usuario loja-------------------*/
  cadastrausuario = async () => {
    const payload = JSON.stringify({
      nome: this.state.nomeuser,
      email: this.state.emailuser,
      pass: this.state.passuser,
      userRole: this.state.userrole,
      shoppingslug: this.state.shoppingslug,
      lojaslug: this.state.lojaslug,
      shoppingid: this.state.shoppingid,
      lojaid: this.state.lojaid,
    });

    console.log(payload);

    await fetch("https://api-shopycash1.herokuapp.com/api/loja/cadastro", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("@token"),
      },
      body: payload,
    })
      .then((res) => res.json())
      .then((res) => localStorage.setItem("@messageuser", JSON.stringify(res)))
      .catch((error) => {
        localStorage.setItem("@message", error);
        console.log(error);
      });

    window.location.reload();
  };

  render() {

    return (
      <DashboardLoja>
        <Section>
          <Title>
            Cadastro de Categorias - {localStorage.getItem("@loja")} - {localStorage.getItem("@shopping")}
          </Title>
          <span>
            Usuario Logado: {localStorage.getItem("@nome")} - {localStorage.getItem("@email")}
          </span>
          <Input
            style={{ width: "99%" }}
            type="text"
            placeholder="Nome"
            required={true}
            name="nome"
            value={this.state.nome}
            onChange={this.handleChange}
          />
          
          <Button value="Submit" onClick={this.cadastrarproduto}>
              Cadastrar
            </Button>
         
        </Section>
        <Section>
          <Label>Categorias</Label>
          <table>
            <thead>
              <tr>
                <th>NOME</th>
                <th>Produtos</th>
                <th>Ações</th>
              </tr>
            </thead>
          </table>
          {this.state.categorialist.map((item) => {
            return (
              <tbody>
                <tr>
                  <tb>
                    {item.nome}
                  </tb>
                  <tb>
                    0
                  </tb>
                  <tb>
                  <EditBt
                    onClick={() =>
                      this.openModal(
                        item.nomefantasia,
                        item.razaosocial,
                        item.shopping,
                        item.cnpj,
                        item.email,
                        item.site,
                        item.telefone,
                        item.responsavel,
                        item.slug
                      )
                    }
                  >
                    <Icon name="edit-pencil-simple" />
                    EDITAR
                  </EditBt>
                  <DeleteBt onClick={() => this.deleteloja(item._id)}>
                    <Icon name="x" />
                    EXCLUIR
                  </DeleteBt>
                  </tb>
                </tr>
              </tbody>
            );
          })}
        </Section>
        <div>
          <Modal
            isOpen={this.state.isModalOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={this.state.customStyles}
          >
            <div>
              {this.state.shoppingslugedit}
              <Input
                style={{ width: "100%" }}
                type="text"
                placeholder="Shopping"
                required={true}
                name="nomeedit"
                value={this.state.nomeedit}
                onChange={this.handleChange}
              />

              <Input
                value={this.state.enderecoedit}
                style={{ width: "100%" }}
                type="text"
                placeholder="Endereço"
                name="enderecoedit"
                required={true}
                onChange={this.handleChange}
              />

              <Input
                value={this.state.cnpjedit}
                style={{ width: "25%" }}
                type="number"
                placeholder="CNPJ"
                name="cnpjedit"
                required={true}
                onChange={this.handleChange}
              />
              <Input
                value={this.state.telefoneedit}
                style={{ width: "25%" }}
                type="tel"
                placeholder="Telefone"
                name="telefoneedit"
                required={true}
                onChange={this.handleChange}
              />

              <Input
                value={this.state.emailedit}
                style={{ width: "48.51%" }}
                type="email"
                placeholder="Email"
                name="emailedit"
                required={true}
                onChange={this.handleChange}
              />
              <Input
                value={this.state.siteedit}
                style={{ width: "50%" }}
                type="url"
                placeholder="Site"
                name="siteedit"
                onChange={this.handleChange}
              />

              <Input
                value={this.state.responsaveledit}
                style={{ width: "24%" }}
                type="text"
                placeholder="Responsavel"
                name="responsaveledit"
                required={true}
                onChange={this.handleChange}
              />
              <Input
                value={this.state.shoppingslugedit}
                style={{ width: "24%" }}
                type="text"
                placeholder="Shoppign slug"
                name="shoppingslugedit"
                required={true}
                onChange={this.handleChange}
              />

              <hr />
              <Button value="Submit" onClick={this.updateloja}>
                Alterar
              </Button>
            </div>
            <button onClick={this.closeModal}>close</button>
          </Modal>
          <Modal
            isOpen={this.state.isModalDelOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeDelModal}
            style={this.state.customStyles}
          >
            <div>
              {this.state._id}

              <DeleteBt onclick={() => this.deleteloja()}>DELETE</DeleteBt>
            </div>
            <button onClick={this.closeDelModal}>close</button>
          </Modal>
        </div>
      </DashboardLoja>
    );
  }
}

export default CadastroCat;