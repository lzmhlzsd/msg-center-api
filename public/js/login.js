/**
 * Created by lkj on 2016/7/10.
 */
/**
 * Created by lkj on 2016/6/27.
 */
import { Button, Form, Input } from 'antd';
const createForm = Form.create;
const FormItem = Form.Item;

function noop() {
    return false;
}

let BasicDemo = React.createClass({
    handleReset(e) {
        e.preventDefault();
        this.props.form.resetFields();
    },

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            console.log('Submit!!!');
            console.log(values);
        });
    },

    userExists(rule, value, callback) {
        if (!value) {
            callback();
        } else {
            setTimeout(() => {
                if (value === 'JasonWood') {
                    callback([new Error('抱歉，该用户名已被占用。')]);
                } else {
                    callback();
                }
            }, 800);
        }
    },

    checkPass(rule, value, callback) {
        const { validateFields } = this.props.form;
        if (value) {
            validateFields(['rePasswd'], {force: true});
        }
        callback();
    },

    checkPass2(rule, value, callback) {
        const { getFieldValue } = this.props.form;
        if (value && value !== getFieldValue('passwd')) {
            callback('两次输入密码不一致！');
        } else {
            callback();
        }
    },

    render() {
        const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
        const nameProps = getFieldProps('name', {
            rules: [
                {required: true, min: 5, message: '用户名至少为 5 个字符'},
                {validator: this.userExists},
            ]
        });
        const emailProps = getFieldProps('email', {
            validate: [{
                rules: [
                    {required: true},
                ],
                trigger: 'onBlur'
            }, {
                rules: [
                    {type: 'email', message: '请输入正确的邮箱地址'},
                ],
                trigger: ['onBlur', 'onChange']
            }]
        });
        const passwdProps = getFieldProps('passwd', {
            rules: [
                {required: true, whitespace: true, message: '请填写密码'},
                {validator: this.checkPass},
            ]
        });
        const rePasswdProps = getFieldProps('rePasswd', {
            rules: [{
                required: true,
                whitespace: true,
                message: '请再次输入密码'
            }, {
                validator: this.checkPass2
            }]
        });
        const textareaProps = getFieldProps('textarea', {
            rules: [
                {required: true, message: '真的不打算写点什么吗？'}
            ]
        });
        const formItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 12}
        };
        return (
            <Form horizontal form={this.props.form}>
                <FormItem
{...formItemLayout}
                    label="账号"
                    hasFeedback
                    help={isFieldValidating('name') ? '校验中...' : (getFieldError('name') || []).join(', ')}
                >
                    <Input {...nameProps} placeholder="手机号码1233" />
                </FormItem>

                <FormItem
{...formItemLayout}
                    label="邮箱1"
                    hasFeedback
                >
                    <Input {...emailProps} type="email" placeholder="onBlur 与 onChange 相结合" />
                </FormItem>

                <FormItem
{...formItemLayout}
                    label="密码"
                    hasFeedback
                >
                    <Input {...passwdProps} type="password" autoComplete="off"
                        onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
                    />
                </FormItem>

                <FormItem
{...formItemLayout}
                    label="确认密码"
                    hasFeedback
                >
                    <Input {...rePasswdProps} type="password" autoComplete="off" placeholder="两次输入密码保持一致"
                        onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
                    />
                </FormItem>

                <FormItem
{...formItemLayout}
                    label="备1注"
                >
                    <Input {...textareaProps} type="textarea" placeholder="随便写" id="textarea" name="textarea" />
                </FormItem>

                <FormItem wrapperCol={{span: 12, offset: 7}}>
                    <Button type="primary" onClick={this.handleSubmit}>确定</Button>
                &nbsp;&nbsp;&nbsp;
                    <Button type="ghost" onClick={this.handleReset}>重置</Button>
                </FormItem>
            </Form>
        );
    }
});

module.exports = BasicDemo = createForm()(BasicDemo);
//
//ReactDOM.render(<BasicDemo />, document.getElementById("app"));